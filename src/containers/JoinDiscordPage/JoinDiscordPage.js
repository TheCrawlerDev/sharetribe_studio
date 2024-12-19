import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { ensureCurrentUser } from '../../util/data';
import { sendVerificationEmail } from '../../ducks/user.duck';
import { isScrollingDisabled } from '../../ducks/ui.duck';

import { H3, Page, UserNav, LayoutSideNavigation, Button, NamedRedirect } from '../../components';

import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';
import FooterContainer from '../../containers/FooterContainer/FooterContainer';

import DiscordIconPng from '../../assets/discord.png';

import {
  saveCalendarDetails,
  saveContactDetailsClear,
  resetPassword,
  G_CALENDAR_TYPE,
  I_CALENDAR_TYPE,
} from './JoinDiscordPage.duck';
import css from './JoinDiscordPage.module.css';

export const JoinDiscordPageComponent = props => {
  const {
    saveEmailError,
    savePhoneNumberError,
    saveContactDetailsInProgress,
    currentUser,
    contactDetailsChanged,
    onChange,
    scrollingDisabled,
    sendVerificationEmailInProgress,
    sendVerificationEmailError,
    onResendVerificationEmail,
    onSubmitContactDetails,
    onResetPassword,
    onCalendar,
    resetPasswordInProgress,
    resetPasswordError,
    intl,
  } = props;

  const user = ensureCurrentUser(currentUser);
  const currentEmail = user?.attributes.email || '';
  const protectedData = user?.attributes?.profile?.protectedData || {};
  const currentPhoneNumber = protectedData?.phoneNumber || '';
  const currentGCalendar = protectedData?.gCalendar || '';
  const currentICalendar = protectedData?.iCalendar || '';

  let premiumUser = currentUser.attributes.profile.publicData?.subscription_paywall ? true : false;

  console.log({user});

  if (user !== null && user !== undefined && premiumUser == false) {
    return <NamedRedirect name="SubscriptionPlansPage"/>;
  }

  const title = intl.formatMessage({ id: 'JoinDiscordPage.title' });

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation
        topbar={
          <>
            <TopbarContainer
              currentPage="JoinDiscordPage"
              desktopClassName={css.desktopTopbar}
              mobileClassName={css.mobileTopbar}
            />
            <UserNav currentPage="JoinDiscordPage" />
          </>
        }
        sideNav={null}
        useAccountSettingsNav
        premiumUser
        currentPage="JoinDiscordPage"
        footer={<FooterContainer />}
      >
        <div className={css.content}>
          <H3 as="h1">
            <FormattedMessage id="JoinDiscordPage.heading" />
          </H3>
          <Button
            className={`${css.submitButton} ${css.qrCode} ${css.inviteToDiscordButton}`}
            style={{
              backgroundImage: `url(${DiscordIconPng})`,
              backgroundSize: '195px 37px',
              backgroundPosition: 'center center',
              backgroundColor: '#5865F2',
            }}
            onClick={() => {
              window.open('https://discord.gg/SQa89hh5xN', '_blank');
            }}
          >
            {/* <span className={css.buttonIcon}>{DiscordIconLogo}</span> */}
            {/* <img src= alt="Red dot" /> */}
            {/* <FormattedMessage id="ProfileSettingsForm.inviteToDiscordButton" /> */}
          </Button>
        </div>
      </LayoutSideNavigation>
    </Page>
  );
};

JoinDiscordPageComponent.defaultProps = {
  saveEmailError: null,
  savePhoneNumberError: null,
  currentUser: null,
  sendVerificationEmailError: null,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

const { bool, func } = PropTypes;

JoinDiscordPageComponent.propTypes = {
  saveEmailError: propTypes.error,
  savePhoneNumberError: propTypes.error,
  saveContactDetailsInProgress: bool.isRequired,
  currentUser: propTypes.currentUser,
  contactDetailsChanged: bool.isRequired,
  onChange: func.isRequired,
  // onSubmitContactDetails: func.isRequired,
  scrollingDisabled: bool.isRequired,
  sendVerificationEmailInProgress: bool.isRequired,
  sendVerificationEmailError: propTypes.error,
  onResendVerificationEmail: func.isRequired,
  resetPasswordInProgress: bool,
  resetPasswordError: propTypes.error,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  // Topbar needs user info.
  const { currentUser, sendVerificationEmailInProgress, sendVerificationEmailError } = state.user;
  const {
    saveEmailError,
    savePhoneNumberError,
    saveContactDetailsInProgress,
    contactDetailsChanged,
    resetPasswordInProgress,
    resetPasswordError,
  } = state.JoinDiscordPage;
  return {
    saveEmailError,
    savePhoneNumberError,
    saveContactDetailsInProgress,
    currentUser,
    contactDetailsChanged,
    scrollingDisabled: isScrollingDisabled(state),
    sendVerificationEmailInProgress,
    sendVerificationEmailError,
    resetPasswordInProgress,
    resetPasswordError,
  };
};

const mapDispatchToProps = dispatch => ({
  onChange: () => dispatch(saveContactDetailsClear()),
  onResendVerificationEmail: () => dispatch(sendVerificationEmail()),
  // onSubmitContactDetails: values => dispatch(saveCalendarDetails(values)),
  onCalendar: values => dispatch(saveCalendarDetails(values)),
  onResetPassword: values => dispatch(resetPassword(values)),
});

const JoinDiscordPage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(JoinDiscordPageComponent);

export default JoinDiscordPage;
