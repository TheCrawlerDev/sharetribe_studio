import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { ensureCurrentUser } from '../../util/data';
import { sendVerificationEmail } from '../../ducks/user.duck';
import { isScrollingDisabled } from '../../ducks/ui.duck';

import { Field, Form } from 'react-final-form';

import { OnChange } from 'react-final-form-listeners';

import {
  H3,
  Page,
  UserNav,
  Button,
  FieldTextInput,
  LayoutSingleColumn,
  NamedRedirect,
} from '../../components';

import TopbarContainer from '../TopbarContainer/TopbarContainer';
import FooterContainer from '../FooterContainer/FooterContainer';

import {
  saveCalendarDetails,
  saveContactDetailsClear,
  resetPassword,
  G_CALENDAR_TYPE,
  I_CALENDAR_TYPE,
} from './ShareProfilePage.duck';
import css from './ShareProfilePage.module.css';
import { createQrCode, getMe, saveUsernameMe } from '../../util/api';

export const ShareProfilePageComponent = props => {
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
  const currentEmail = user?.attributes?.email || '';
  const protectedData = user?.attributes?.profile?.protectedData || {};
  const publicData = user?.attributes.profile?.publicData || {};
  const currentPhoneNumber = protectedData?.phoneNumber || '';
  const currentGCalendar = protectedData?.gCalendar || '';
  const currentICalendar = protectedData?.iCalendar || '';

  const [qrCode, setQrCode] = React.useState(null);

  const [urlQRCode, setUrlQRCode] = React.useState(
    publicData?.username
      ? `${window.location.origin}/u/${user.id.uuid}`
      : `${window.location.origin}/u/${user.id.uuid}`
  );
  const [usernameAvailability, setUsernameAvailability] = React.useState(
    !!publicData?.username ? true : false
  );
  const [username, setUsername] = React.useState(
    !!publicData?.username ? publicData?.username : ''
  );

  const [savedUsername, setSavedUsername] = React.useState(
    !!publicData?.username ? publicData?.username : ''
  );

  useEffect(() => {
    let key = 'myStudioBookQrCode';
    let storedQrCode = localStorage.getItem(key);
    if (storedQrCode) {
      setQrCode(storedQrCode);
    } else {
      createQrCode(urlQRCode).then(result => {
        setQrCode(result.qr);
        localStorage.setItem(key, result.qr);
      });
    }
  }, []);

  useEffect(() => {
    getMe(username)
      .then(data => {
        let availability = data?.data?.data?.Count == 0;
        setUsernameAvailability(availability);
      })
      .catch(error => {
        console.log(error);
      });
  }, [username]);

  useEffect(() => {
    let key = 'myStudioBookQrCode';
    createQrCode(urlQRCode).then(result => {
      setQrCode(result.qr);
      localStorage.setItem(key, result.qr);
    });
  }, [urlQRCode]);

  let premiumUser = currentUser?.attributes?.profile?.publicData?.subscription_paywall
    ? true
    : false;

  if (user !== null && user !== undefined && premiumUser == false) {
    return <NamedRedirect name="SubscriptionPlansPage" />;
  }

  const title = intl.formatMessage({ id: 'ShareProfilePage.title' });

  return (
    <Page className={css.root} title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSingleColumn
        topbar={
          <>
            <TopbarContainer currentPage="ShareProfilePage" />
            <UserNav currentPage="ShareProfilePage" />
          </>
        }
        footer={<FooterContainer />}
      >
        <div className={css.content}>
          <H3 as="h1">
            <FormattedMessage id="ShareProfilePage.heading" />
          </H3>
          <Form
            onSubmit={values => {
              console.log({ values });
              saveUsernameMe({ username: values.usernameMe, uuid: values.uuid })
                .then(data => {
                  setSavedUsername(values.usernameMe);
                  // setUrlQRCode(`${window.location.origin}/me/${username}`);
                })
                .catch(err => {
                  console.log(err);
                });
            }}
            initialValues={{ usernameMe: username, uuid: user.id.uuid }}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <FieldTextInput type="hidden" id="uuid" name="uuid" />
                <FieldTextInput
                  className={css.qrCode}
                  type="text"
                  id="usernameMe"
                  name="usernameMe"
                  placeholder="Enter your username"
                />
                <OnChange name="usernameMe">
                  {(value, previous) => {
                    setUsername(value);
                  }}
                </OnChange>
                {publicData?.username && <label>{savedUsername} is your username right now</label>}
                {publicData?.username != username &&
                  savedUsername != username &&
                  usernameAvailability && (
                    <>
                      <label className={`${css.labelGreen}`}>
                        Username {username} is available
                      </label>
                      <Button className={`${css.submitButton} ${css.qrCode}`} type="submit">
                        Save
                      </Button>
                    </>
                  )}
                {publicData?.username != username && !usernameAvailability && (
                  <label className={`${css.labelRed}`}>Username {username} isn't available</label>
                )}
              </form>
            )}
          />
          {!!qrCode ? (
            <>
              <img className={css.qrCode} src={qrCode} alt="StudioBookQRCode" />
              <Button
                className={`${css.submitButton} ${css.qrCode}`}
                onClick={() => {
                  var a = document.createElement('a'); //Create <a>
                  a.href = qrCode; //Image Base64 Goes here
                  a.download = 'studiobook-profile-qrcode.png'; //File name Here
                  a.click(); //Downloaded file
                }}
              >
                <FormattedMessage id="ProfileSettingsForm.exportQRCode" />
              </Button>
              {/* <a href={qrCode} download="studiobook-profile-qrcode.png">
                If your download doesn't work click here
              </a> */}

              <Form
                onSubmit={values => {
                  var formattedBody = `Follow me on ${window.location.origin}/u/${user.id.uuid}`;
                  var mailToLink = `mailto:${values.email}?body=${encodeURIComponent(
                    formattedBody
                  )}&subject=${encodeURIComponent(formattedBody)}`;
                  window.open(mailToLink);
                }}
                render={({ handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <FieldTextInput
                      className={css.qrCode}
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter Email"
                    />

                    <Button className={`${css.submitButton} ${css.qrCode}`} type="submit">
                      <FormattedMessage id="ProfileSettingsForm.sendLinkQRCode" />
                    </Button>
                  </form>
                )}
              />
            </>
          ) : null}
        </div>
      </LayoutSingleColumn>
    </Page>
  );
};

ShareProfilePageComponent.defaultProps = {
  saveEmailError: null,
  savePhoneNumberError: null,
  currentUser: null,
  sendVerificationEmailError: null,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

const { bool, func } = PropTypes;

ShareProfilePageComponent.propTypes = {
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
  } = state.ShareProfilePage;
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

const ShareProfilePage = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(ShareProfilePageComponent);

export default ShareProfilePage;
