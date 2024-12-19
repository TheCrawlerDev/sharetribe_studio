import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { Heading, Modal, SocialLoginButton, UserCard } from '../../components';
import InquiryForm from './InquiryForm/InquiryForm';
import {
  BandCampLogo,
  WebsiteIconLogo,
  InstagramLogo,
  ItunesLogo,
  SpotifyIconLogo,
  SoundCloudLogo,
  TidalIconLogo,
} from '../../containers/AuthenticationPage/socialLoginLogos';

import css from './ListingPage.module.css';
import { baseUrlSocial } from '../../util/added';
import Waveform from '../AudioPlayer/Waveform';
import { baseApiExternalFiles } from '../../util/api';

const SectionAuthorMaybe = props => {
  const {
    title,
    listing,
    authorDisplayName,
    onContactUser,
    isInquiryModalOpen,
    onCloseInquiryModal,
    sendInquiryError,
    sendInquiryInProgress,
    onSubmitInquiry,
    currentUser,
    onManageDisableScrolling,
  } = props;

  if (!listing.author) {
    return null;
  }

  const publicData = listing.author.attributes.profile.publicData;

  const openSocialNetWork = (networkName, baseUrl = '') => {
    window.open(publicData[networkName]);
  };

  return (
    <div id="author" className={css.sectionAuthor}>
      <Heading as="h2" rootClassName={css.sectionHeadingWithExtraMargin}>
        <FormattedMessage id="ListingPage.aboutProviderTitle" />
      </Heading>
      <UserCard user={listing.author} currentUser={currentUser} onContactUser={onContactUser} />
      <div style={{ display: 'flex' }}>
        {!!publicData?.appleMusic ? (
          <SocialLoginButton
            type="button"
            className={css.socialIcon}
            onClick={() => openSocialNetWork('appleMusic')}
          >
            <span className={css.buttonIcon}>{ItunesLogo}</span>
          </SocialLoginButton>
        ) : null}
        {!!publicData?.spotify ? (
          <SocialLoginButton
            type="button"
            className={css.socialIcon}
            onClick={() => openSocialNetWork('spotify', baseUrlSocial.spotify)}
          >
            <span className={css.buttonIcon}>{SpotifyIconLogo}</span>
          </SocialLoginButton>
        ) : null}
        {!!publicData?.bandcamp ? (
          <SocialLoginButton
            type="button"
            className={css.socialIcon}
            onClick={() => openSocialNetWork('bandcamp')}
          >
            <span className={css.buttonIcon}>{BandCampLogo}</span>
          </SocialLoginButton>
        ) : null}
        {!!publicData?.soundcloud ? (
          <SocialLoginButton
            type="button"
            className={css.socialIcon}
            onClick={() => openSocialNetWork('soundcloud', baseUrlSocial.soundcloud)}
          >
            <span className={css.buttonIcon}>{SoundCloudLogo}</span>
          </SocialLoginButton>
        ) : null}
        {!!publicData?.tidal ? (
          <SocialLoginButton
            type="button"
            className={css.socialIcon}
            onClick={() => openSocialNetWork('tidal', baseUrlSocial.tidal)}
          >
            <span className={css.buttonIcon}>{TidalIconLogo}</span>
          </SocialLoginButton>
        ) : null}
      </div>

      {publicData?.song?.Location && (
        <div className={css.WaveAudio}>
          <Waveform
            url={publicData?.song?.Location}
            height="40"
            label={publicData?.song?.label}
            labelAligment="30%"
          ></Waveform>
        </div>
      )}

      <Modal
        id="ListingPage.inquiry"
        contentClassName={css.inquiryModalContent}
        isOpen={isInquiryModalOpen}
        onClose={onCloseInquiryModal}
        usePortal
        onManageDisableScrolling={onManageDisableScrolling}
      >
        <InquiryForm
          className={css.inquiryForm}
          submitButtonWrapperClassName={css.inquirySubmitButtonWrapper}
          listingTitle={title}
          authorDisplayName={authorDisplayName}
          sendInquiryError={sendInquiryError}
          onSubmit={onSubmitInquiry}
          inProgress={sendInquiryInProgress}
        />
      </Modal>
    </div>
  );
};

export default SectionAuthorMaybe;
