import React, { Component, useState } from 'react';
import { array, bool, func, number, object, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import classNames from 'classnames';

import { FormattedMessage, intlShape, injectIntl } from '../../../util/reactIntl';
import { timestampToDate } from '../../../util/dates';
import { propTypes } from '../../../util/types';
import { BOOKING_PROCESS_NAME } from '../../../transactions/transaction';
import arrayMutators from 'final-form-arrays';
import { Form, H6, PrimaryButton, FieldCheckbox, Modal } from '../../../components';
import { FieldArray } from 'react-final-form-arrays';
import { Link } from 'react-router-dom';

import EstimatedCustomerBreakdownMaybe from '../EstimatedCustomerBreakdownMaybe';
import FieldDateAndTimeInput from './FieldDateAndTimeInput';

import css from './BookingTimeForm.module.css';
import { apiExternalFiles, baseApiExternalFiles } from '../../../util/api';

export class BookingTimeFormComponent extends Component {
  constructor(props) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleFormSubmit(e) {
    this.props.onSubmit(e);
  }

  // When the values of the form are updated we need to fetch
  // lineItems from this template's backend for the EstimatedTransactionMaybe
  // In case you add more fields to the form, make sure you add
  // the values here to the orderData object.
  handleOnChange(formValues) {
    const { bookingStartTime, bookingEndTime, add_ons } = formValues.values;
    const startDate = bookingStartTime ? timestampToDate(bookingStartTime) : null;
    const endDate = bookingEndTime ? timestampToDate(bookingEndTime) : null;

    const listingId = this.props.listingId;
    const isOwnListing = this.props.isOwnListing;

    // Note: we expect values bookingStartTime and bookingEndTime to be strings
    // which is the default case when the value has been selected through the form
    const isStartBeforeEnd = bookingStartTime < bookingEndTime;

    if (
      bookingStartTime &&
      bookingEndTime &&
      isStartBeforeEnd &&
      !this.props.fetchLineItemsInProgress
    ) {
      this.props.onFetchTransactionLineItems({
        orderData: { bookingStart: startDate, bookingEnd: endDate, addOns: add_ons },
        listingId,
        isOwnListing,
      });
    }
  }

  render() {
    const {
      rootClassName,
      className,
      price: unitPrice,
      dayCountAvailableForBooking,
      marketplaceName,
      ...rest
    } = this.props;
    const classes = classNames(rootClassName || css.root, className);
    return (
      <FinalForm
        {...rest}
        unitPrice={unitPrice}
        mutators={{ ...arrayMutators }}
        onSubmit={this.handleFormSubmit}
        render={fieldRenderProps => {
          const {
            endDatePlaceholder,
            startDatePlaceholder,
            form,
            pristine,
            handleSubmit,
            intl,
            isOwnListing,
            listingId,
            author,
            values,
            monthlyTimeSlots,
            onFetchTimeSlots,
            timeZone,
            lineItems,
            fetchLineItemsInProgress,
            fetchLineItemsError,
          } = fieldRenderProps;

          const addOns = fieldRenderProps?.publicData?.add_ons ?? [];
          const terms = fieldRenderProps?.publicData?.terms ?? {};
          const startTime = values && values.bookingStartTime ? values.bookingStartTime : null;
          const endTime = values && values.bookingEndTime ? values.bookingEndTime : null;
          const startDate = startTime ? timestampToDate(startTime) : null;
          const endDate = endTime ? timestampToDate(endTime) : null;
          const [isTermsAccepted, setTermsAccepted] = useState(!terms);

          // This is the place to collect breakdown estimation data. See the
          // EstimatedCustomerBreakdownMaybe component to change the calculations
          // for customized payment processes.
          const breakdownData =
            startDate && endDate
              ? {
                  startDate,
                  endDate,
                }
              : null;

          const showEstimatedBreakdown =
            breakdownData && lineItems && !fetchLineItemsInProgress && !fetchLineItemsError;

          return (
            <Form onSubmit={handleSubmit} className={classes} enforcePagePreloadFor="CheckoutPage">
              <FormSpy
                subscription={{ values: true }}
                onChange={values => {
                  this.handleOnChange(values);
                }}
              />
              {monthlyTimeSlots && timeZone ? (
                <FieldDateAndTimeInput
                  startDateInputProps={{
                    label: intl.formatMessage({ id: 'BookingTimeForm.bookingStartTitle' }),
                    placeholderText: startDatePlaceholder,
                  }}
                  endDateInputProps={{
                    label: intl.formatMessage({ id: 'BookingTimeForm.bookingEndTitle' }),
                    placeholderText: endDatePlaceholder,
                  }}
                  className={css.bookingDates}
                  author={author}
                  listingId={listingId}
                  onFetchTimeSlots={onFetchTimeSlots}
                  monthlyTimeSlots={monthlyTimeSlots}
                  values={values}
                  intl={intl}
                  form={form}
                  pristine={pristine}
                  timeZone={timeZone}
                  dayCountAvailableForBooking={dayCountAvailableForBooking}
                />
              ) : null}
              <div style={{ paddingTop: '10%' }}>
                <FieldArray name="add_ons">
                  {({ fields }) => (
                    <div>
                      {addOns.length > 0 && addOns.map((add, index) => {
                        const addOn = addOns[index];
                        const name = `add_ons[${index}].id`;
                        return (
                          <div
                            style={{
                              flex: '1 1',
                              display: 'flex',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                            }}
                          >
                            <FieldCheckbox
                              className={css.checkBoxHour}
                              id={`add_on_${addOn?.id}`}
                              name={name}
                              label={addOn?.label}
                              value={addOn?.id}
                            />
                            <label className={css.labelValueHour}>
                              $ {addOn?.value} / hour
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </FieldArray>
              </div>
              {showEstimatedBreakdown ? (
                <div className={css.priceBreakdownContainer}>
                  <H6 as="h3" className={css.bookingBreakdownTitle}>
                    <FormattedMessage id="BookingTimeForm.priceBreakdownTitle" />
                  </H6>
                  <hr className={css.totalDivider} />
                  <EstimatedCustomerBreakdownMaybe
                    breakdownData={breakdownData}
                    lineItems={lineItems}
                    timeZone={timeZone}
                    currency={unitPrice.currency}
                    marketplaceName={marketplaceName}
                    processName={BOOKING_PROCESS_NAME}
                  />
                </div>
              ) : null}

              {fetchLineItemsError ? (
                <span className={css.sideBarError}>
                  <FormattedMessage id="BookingTimeForm.fetchLineItemsError" />
                </span>
              ) : null}

              <div className={css.submitButton}>
                {!!terms?.Location && (
                  <FieldCheckbox
                    id="terms_and_conditions"
                    name="terms_and_conditions"
                    onChange={input => {
                      setTermsAccepted(input.target.checked);
                    }}
                    label={
                      <div>
                        I agree to the
                        <a
                          onClick={e => {
                            e.preventDefault();
                            apiExternalFiles(terms.Location)
                              .then(response => response.blob())
                              .then(blob => {
                                const url = window.URL.createObjectURL(new Blob([blob]));
                                const link = document.createElement('a');
                                link.href = url;
                                link.setAttribute('target', '_blank');
                                link.setAttribute(
                                  'download',
                                  `terms-and-conditions-${listingId.uuid}.pdf`
                                );

                                // Append to html link element page
                                document.body.appendChild(link);

                                // Start download
                                link.click();

                                // Clean up and remove the link
                                link.parentNode.removeChild(link);
                              })
                              .catch(e => {
                                // console.log(e);
                              });
                          }}
                        >
                          &nbsp;booking agreement
                        </a>
                        &nbsp;(Click to Download)
                      </div>
                    }
                    value="false"
                  />
                )}

                <PrimaryButton
                  type="submit"
                  inProgress={fetchLineItemsInProgress}
                  disabled={!!terms && !!terms?.Location ? !isTermsAccepted : false}
                >
                  <FormattedMessage id="BookingTimeForm.requestToBook" />
                </PrimaryButton>
              </div>

              <p className={css.finePrint}>
                <FormattedMessage
                  id={
                    isOwnListing
                      ? 'BookingTimeForm.ownListing'
                      : 'BookingTimeForm.youWontBeChargedInfo'
                  }
                />
              </p>
            </Form>
          );
        }}
      />
    );
  }
}

BookingTimeFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  price: null,
  isOwnListing: false,
  listingId: null,
  author: null,
  startDatePlaceholder: null,
  endDatePlaceholder: null,
  monthlyTimeSlots: null,
  lineItems: null,
  fetchLineItemsError: null,
};

BookingTimeFormComponent.propTypes = {
  rootClassName: string,
  className: string,

  marketplaceName: string.isRequired,
  price: propTypes.money,
  isOwnListing: bool,
  listingId: propTypes.uuid,
  monthlyTimeSlots: object,
  onFetchTimeSlots: func.isRequired,
  timeZone: string.isRequired,

  onFetchTransactionLineItems: func.isRequired,
  lineItems: array,
  fetchLineItemsInProgress: bool.isRequired,
  fetchLineItemsError: propTypes.error,

  // from injectIntl
  intl: intlShape.isRequired,

  // for tests
  startDatePlaceholder: string,
  endDatePlaceholder: string,

  dayCountAvailableForBooking: number.isRequired,
};

const BookingTimeForm = compose(injectIntl)(BookingTimeFormComponent);
BookingTimeForm.displayName = 'BookingTimeForm';

export default BookingTimeForm;
