import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { Form as FinalForm } from 'react-final-form';

import { FormattedMessage, injectIntl, intlShape } from '../../../util/reactIntl';
import { propTypes } from '../../../util/types';
import { ensureCurrentUser } from '../../../util/data';

import { Form, PrimaryButton, SocialLoginButton, Modal } from '../../../components';

import css from './ContactDetailsForm.module.css';
import { AppleLogo, GoogleCalendarLogo } from '../../AuthenticationPage/socialLoginLogos';
import { GOOGLE_AUTH_COMPLETED, getGoogleAuthUrl, googleAuthByCode } from '../../../util/api';
import { clearQueryParams, create_UUID, getParameterByName, getUrl } from '../../../util/added';

const SHOW_EMAIL_SENT_TIMEOUT = 2000;

class ContactDetailsFormComponent extends Component {
  constructor(props) {
    super(props);
    if (getParameterByName('state') == GOOGLE_AUTH_COMPLETED) {
      const code = getParameterByName('code');
      googleAuthByCode(code, getUrl(window))
        .then(result => {
          this.handleOnGCalendar({
            integrationCode: create_UUID(),
            code: code,
            ...result.data,
            refresh_at: {
              date: new Date().toISOString(),
              in_seconds: Math.ceil(new Date().getTime() / 1000),
              in_millis: new Date().getTime(),
            },
            generated_at: {
              date: new Date().toISOString(),
              in_seconds: Math.ceil(new Date().getTime() / 1000),
              in_millis: new Date().getTime(),
            },
          });
        })
        .catch(() => {
          // clearQueryParams();
        });
    }
    this.state = { showVerificationEmailSentMessage: false, showResetPasswordMessage: false };
    this.emailSentTimeoutId = null;
    this.handleOnGCalendar = this.handleOnGCalendar.bind(this);
    this.handleOnICalendar = this.handleOnICalendar.bind(this);
    this.submittedValues = {};
  }

  componentWillUnmount() {
    window.clearTimeout(this.emailSentTimeoutId);
  }

  handleOnGCalendar(data) {
    this.props.onGCalendar(data);
  }

  handleOnICalendar(data) {
    this.props.onICalendar(data);
  }

  render() {
    return (
      <FinalForm
        {...this.props}
        render={fieldRenderProps => {
          const {
            rootClassName,
            className,
            currentUser,
            handleSubmit,
            inProgress,
            invalid,
            values,
          } = fieldRenderProps;

          const user = ensureCurrentUser(currentUser);

          if (!user.id) {
            return null;
          }

          const { profile } = user.attributes;

          const protectedData = profile.protectedData || {};

          const classes = classNames(rootClassName || css.root, className);
          const submittedOnce = Object.keys(this.submittedValues).length > 0;
          const pristineSinceLastSubmit = submittedOnce && isEqual(values, this.submittedValues);
          const submitDisabled = invalid || pristineSinceLastSubmit || inProgress;

          const [confirmRemoveGCalendarisOpen, setConfirmRemoveGCalendarisOpen] = React.useState(
            false
          );

          const handleOpen = () => {
            setConfirmRemoveGCalendarisOpen(true);
          };

          if (
            getParameterByName('code') != null &&
            getParameterByName('code') == protectedData.gCalendar?.code
          ) {
            clearQueryParams(window);
          }

          return (
            <Form
              className={classes}
              onSubmit={e => {
                this.submittedValues = values;
                handleSubmit(e);
              }}
            >
              {(protectedData.gCalendar?.access_token && (
                <div className={css.contactDetailsSection}>
                  <Modal
                    {...this.props}
                    id="ModalIntegrateCalendar"
                    isOpen={confirmRemoveGCalendarisOpen}
                    onClose={() => {
                      setConfirmRemoveGCalendarisOpen(false);
                    }}
                    onManageDisableScrolling={(componentId, scrollingDisabled = true) => {}}
                  >
                    <div style={{ margin: '1rem' }}>
                      <FormattedMessage id="IntegrateCalendarsPage.mconfirmRemoveGCalendarKeys" />
                      <div style={{ margin: '1rem', display: 'flex' }}>
                        <div style={{ width: '40%', paddingLeft: '5%' }}>
                          <PrimaryButton
                            className={css.green}
                            onClick={e => {
                              setConfirmRemoveGCalendarisOpen(false);
                            }}
                          >
                            <FormattedMessage id="IntegrateCalendarsPage.nconfirmRemoveGCalendarKeys" />
                          </PrimaryButton>
                        </div>
                        <div style={{ width: '40%', paddingLeft: '5%' }}>
                          <PrimaryButton
                            className={css.fail}
                            onClick={e => {
                              this.handleOnGCalendar({});
                            }}
                          >
                            <FormattedMessage id="IntegrateCalendarsPage.confirmRemoveGCalendarKeys" />
                          </PrimaryButton>
                        </div>
                      </div>
                    </div>
                  </Modal>
                  <SocialLoginButton
                    type="button"
                    style={{ backgroundColor: 'green' }}
                    className={css.green}
                    onClick={handleOpen}
                  >
                    <span className={css.buttonIcon}>{GoogleCalendarLogo}</span>
                    <FormattedMessage id="IntegrateCalendarsPage.googleButtonCalendarIntegrated" />
                  </SocialLoginButton>
                </div>
              )) || (
                <div className={css.contactDetailsSection}>
                  <SocialLoginButton
                    type="button"
                    className={css.white}
                    onClick={e => {
                      window.location.replace(getGoogleAuthUrl(getUrl(window)));
                    }}
                  >
                    <span className={css.buttonIcon}>{GoogleCalendarLogo}</span>
                    <FormattedMessage id="IntegrateCalendarsPage.googleButtonCalendarNIntegrated" />
                  </SocialLoginButton>
                </div>
              )}

              {/* <div className={css.contactDetailsSection}>
                <SocialLoginButton
                  type="button"
                  className={css.white}
                  onClick={() => {
                    alert('Apple Calendar is not ready');
                  }}
                >
                  <span className={css.buttonIcon}>{AppleLogo}</span>
                  <FormattedMessage id="IntegrateCalendarsPage.appleButton" />
                </SocialLoginButton>
              </div> */}
            </Form>
          );
        }}
      />
    );
  }
}

ContactDetailsFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  formId: null,
  saveEmailError: null,
  savePhoneNumberError: null,
  inProgress: false,
  sendVerificationEmailError: null,
  sendVerificationEmailInProgress: false,
  email: null,
  phoneNumber: null,
  gCalendar: null,
  iCalendar: null,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

const { bool, func, string } = PropTypes;

ContactDetailsFormComponent.propTypes = {
  rootClassName: string,
  className: string,
  formId: string,
  saveEmailError: propTypes.error,
  savePhoneNumberError: propTypes.error,
  inProgress: bool,
  intl: intlShape.isRequired,
  onResendVerificationEmail: func.isRequired,
  ready: bool.isRequired,
  sendVerificationEmailError: propTypes.error,
  sendVerificationEmailInProgress: bool,
  resetPasswordInProgress: bool,
  resetPasswordError: propTypes.error,
};

const ContactDetailsForm = compose(injectIntl)(ContactDetailsFormComponent);

ContactDetailsForm.displayName = 'ContactDetailsForm';

export default ContactDetailsForm;
