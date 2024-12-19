import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';

import {
  H3,
  Page,
  PaginationLinks,
  UserNav,
  LayoutSingleColumn,
  NamedLink,
  Button,
  Modal,
} from '../../components';

import { YoutubeEmbed } from '../PageBuilder/Primitives/YoutubeEmbed';

import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';
import FooterContainer from '../../containers/FooterContainer/FooterContainer';
import css from './SubscriptionsPlansPage.module.css';
import { SubscriptionPlansEnum } from './SubscriptionsPlans.enum';
import {
  accessCheckoutSession,
  createCheckoutSession,
  slackAlert,
  successCheckout,
  watchedTutorial,
} from '../../util/api';

export class SubscriptionPlansPageComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listingMenuOpen: null,
      openTutorial: !!props.currentUser.attributes.profile.publicData.listingTutorialOpened
        ? false
        : true,
    };
    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.handleOpenTutorial = this.handleOpenTutorial.bind(this);
    this.handleCloseTutorial = this.handleCloseTutorial.bind(this);
  }

  onToggleMenu(listing) {
    this.setState({ listingMenuOpen: listing });
  }

  handleOpenTutorial(listing) {
    this.setState({ openTutorial: true });
  }

  handleCloseTutorial(listing) {
    this.setState({ openTutorial: false });
    watchedTutorial();
  }

  onPlanClick(plan) {
    alert('You will redirect to stripe in a few moments.');
    createCheckoutSession(plan)
      .then(session => {
        window.location.replace(session.checkout.url);
      })
      .catch(err => console.log(err));
  }

  onPlanRequestChange() {
    alert('You can change your plan directly, needs a admin approval!');
    slackAlert(
      'qa-website-messages',
      `User ${this.props.currentUser.attributes.email} requests approval to change plan.`
    );
  }

  onPlanBillingPortal() {
    accessCheckoutSession()
      .then(session => {
        window.location.replace(session.newSession.url);
      })
      .catch(err => console.log(err));
  }

  createNewListing() {
    const draftId = '00000000-0000-0000-0000-000000000000';
    const draftSlug = 'draft';
    window.location.replace(`/l/${draftSlug}/${draftId}/new/details`);
  }

  // accessCheckoutSession

  render() {
    const {
      pagination,
      queryInProgress,
      queryListingsError,
      queryParams,
      scrollingDisabled,
      currentPageResultIds,
      currentUser,
      intl,
    } = this.props;

    const hasPaginationInfo = !!pagination && pagination.totalItems != null;
    const listingsAreLoaded = !queryInProgress && hasPaginationInfo;

    let plan = currentUser.attributes.profile.publicData?.subscription_paywall
      ? currentUser.attributes.profile.publicData?.subscription_paywall?.plan
      : SubscriptionPlansEnum.FREE;

    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      plan = query.get('plan');
      successCheckout(query.get('session_id'), query.get('plan'))
        .then(response => {})
        .catch(err => console.log(err));
    }

    if (query.get('canceled')) {
    }

    const onManageDisableScrolling = (componentId, scrollingDisabled = true) => {
      // We are just checking the value for now
      console.log('Toggling Modal - scrollingDisabled currently:', componentId, scrollingDisabled);
    };

    const loadingResults = (
      <div className={css.messagePanel}>
        <H3 as="h2" className={css.heading}>
          <FormattedMessage id="ManageListingsPage.loadingOwnListings" />
        </H3>
      </div>
    );

    const queryError = (
      <div className={css.messagePanel}>
        <H3 as="h2" className={css.heading}>
          <FormattedMessage id="ManageListingsPage.queryError" />
        </H3>
      </div>
    );

    const noResults =
      listingsAreLoaded && pagination.totalItems === 0 ? (
        <H3 as="h1" className={css.heading}>
          <FormattedMessage id="ManageListingsPage.noResults" />
        </H3>
      ) : null;

    const heading =
      listingsAreLoaded && pagination.totalItems > 0 ? (
        <H3 as="h1" className={css.heading}>
          <FormattedMessage
            id="ManageListingsPage.youHaveListings"
            values={{ count: pagination.totalItems }}
          />
        </H3>
      ) : (
        noResults
      );

    const page = queryParams ? queryParams.page : 1;

    const title = intl.formatMessage({ id: 'ManageListingsPage.title' });

    const panelWidth = 62.5;
    // Render hints for responsive image
    const renderSizes = [
      `(max-width: 767px) 100vw`,
      `(max-width: 1920px) ${panelWidth / 2}vw`,
      `${panelWidth / 3}vw`,
    ].join(', ');

    const countListing = currentPageResultIds.length;

    const startListing = (
      <Button className={css.contact} onClick={this.createNewListing}>
        Create New Listing
      </Button>
    );

    const unavailable = (
      <Button className={css.contact} disabled={true}>
        Unavailable
      </Button>
    );

    const accessPlan = currentUser.attributes.profile.publicData?.subscription_paywall ? (
      <Button className={css.contact}>Your current plan</Button>
    ) : (
      <Button
        className={css.contact}
        style={{ marginTop: '3%' }}
        onClick={this.onPlanBillingPortal}
      >
        Access My Plan
      </Button>
    );

    const startListingFree =
      countListing == 0 ? (
        startListing
      ) : (
        <Button className={css.contact} disabled={true}>
          No listings available
        </Button>
      );

    const buttonFreePlan =
      plan == SubscriptionPlansEnum.FREE ? (
        startListingFree
      ) : (
        <Button className={css.contact} disabled={true}>
          Unavailable
        </Button>
      );

    const buttonStartPlan =
      plan == SubscriptionPlansEnum.FREE ? (
        <Button
          className={css.contact}
          onClick={() => {
            this.onPlanClick(SubscriptionPlansEnum.START);
          }}
        >
          Subscribe
        </Button>
      ) : plan == SubscriptionPlansEnum.START ? (
        <>
          {startListing}
          {accessPlan}
        </>
      ) : plan == SubscriptionPlansEnum.ADVANCED ? (
        <Button
          className={css.contact}
          onClick={() => {
            this.onPlanRequestChange(SubscriptionPlansEnum.ADVANCED);
          }}
        >
          Change Plan
        </Button>
      ) : (
        unavailable
      );

    const buttonAdvancedPlan =
      plan == SubscriptionPlansEnum.FREE ? (
        <Button
          className={css.contact}
          onClick={() => {
            this.onPlanClick(SubscriptionPlansEnum.ADVANCED);
          }}
        >
          Subscribe
        </Button>
      ) : plan == SubscriptionPlansEnum.START ? (
        <Button
          className={css.contact}
          onClick={() => {
            this.onPlanClick(SubscriptionPlansEnum.ADVANCED);
          }}
        >
          Change Plan
        </Button>
      ) : plan == SubscriptionPlansEnum.ADVANCED ? (
        <>
          {startListing}
          {accessPlan}
        </>
      ) : (
        unavailable
      );

    const enableCreateListingOnModal =
      plan == SubscriptionPlansEnum.START || plan == SubscriptionPlansEnum.ADVANCED
        ? true
        : countListing == 0;

    return (
      <Page title={title} scrollingDisabled={false}>
        <LayoutSingleColumn
          topbar={
            <>
              <TopbarContainer currentPage="ManageListingsPage" />
              <UserNav currentPage="ManageListingsPage" />
            </>
          }
          footer={<FooterContainer />}
        >
          {this.state && (
            <div>
              <Modal
                {...this.props}
                id="ModalTutorial"
                className={css.modalTutorial}
                isOpen={this.state.openTutorial}
                onClose={this.handleCloseTutorial}
                onManageDisableScrolling={(componentId, scrollingDisabled = true) => {}}
              >
                <div style={{ margin: '1rem' }}>
                  Please watch this tutorial to create your listings!
                </div>
                <iframe
                  width="100%"
                  height="400px"
                  src={'https://www.youtube.com/embed/p9OpFUzNQVc'}
                  title="StudioBook Tutorial"
                  referrerPolicy="strict-origin-when-cross-origin"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                {enableCreateListingOnModal && (
                  <Button
                    rootClassName={css.contact}
                    style={{ marginTop: '13%' }}
                    onClick={this.createNewListing}
                  >
                    Create New Listing
                  </Button>
                )}
                {/* <YoutubeEmbed
                  {...this.props}
                  youtubeVideoId={'p9OpFUzNQVc'}
                  aspectRatio={'200/200'}
                ></YoutubeEmbed> */}
              </Modal>
              <div className={css.modalTutorialBody}>
                <p>Troubles?</p>
                <Button onClick={this.handleOpenTutorial}>Watch Tutorial</Button>
              </div>
            </div>
          )}
          <div className={css.listingPanel}>
            <div className={css.row}>
              <div className={css.column}>
                <div className={css.card}>
                  <div className={css.planDetails}>
                    <h3>Free Plan</h3>
                    <p>One Listing</p>
                    <p>Unlimited Bookings</p>
                    <p>5% booking fee</p>
                  </div>
                  {buttonFreePlan}
                </div>
              </div>

              <div className={css.column}>
                <div className={css.card}>
                  <div className={css.planDetails}>
                    <h3>Premium</h3>
                    <p>Unlimited Listings</p>
                    <p>Unlimited Bookings</p>
                    <p>No Booking Fee</p>
                  </div>
                  {buttonStartPlan}
                </div>
              </div>

              <div className={css.column}>
                <div className={css.card}>
                  <div className={css.planDetails}>
                    <h3>Premium Plus</h3>
                    <p>Unlimited Listings</p>
                    <p>Unlimited Bookings</p>
                    <p>No Booking Fee</p>
                    <p>Website Integration</p>
                  </div>
                  {buttonAdvancedPlan}
                </div>
              </div>
            </div>
          </div>
        </LayoutSingleColumn>
      </Page>
    );
  }
}

SubscriptionPlansPageComponent.defaultProps = {};

const { arrayOf, bool, func, object, shape, string } = PropTypes;

SubscriptionPlansPageComponent.propTypes = {};

const mapStateToProps = state => {
  const { currentPageResultIds } = state.ManageListingsPage;
  const { currentUser } = state.user;
  return {
    currentPageResultIds,
    currentUser,
  };
};

const mapDispatchToProps = dispatch => ({
  // onCloseListing: listingId => dispatch(closeListing(listingId)),
  // onOpenListing: listingId => dispatch(openListing(listingId)),
});

const SubscriptionPlansPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(SubscriptionPlansPageComponent);

export default SubscriptionPlansPage;
