import React, { useState } from 'react';
import { bool, arrayOf, number, shape, string } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { useConfiguration } from '../../context/configurationContext';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { REVIEW_TYPE_OF_PROVIDER, REVIEW_TYPE_OF_CUSTOMER, propTypes } from '../../util/types';
import { ensureCurrentUser, ensureUser } from '../../util/data';
import { withViewport } from '../../util/uiHelpers';
import { isScrollingDisabled } from '../../ducks/ui.duck';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import {
  Heading,
  H2,
  H4,
  Page,
  AvatarLarge,
  NamedLink,
  ListingCard,
  Reviews,
  ButtonTabNavHorizontal,
  LayoutSideNavigation,
  SocialLoginButton,
  InlineTextButton,
} from '../../components';
import {
  BandCampLogo,
  WebsiteIconLogo,
  InstagramLogo,
  ItunesLogo,
  SpotifyIconLogo,
  SoundCloudLogo,
  TidalIconLogo,
} from '../../containers/AuthenticationPage/socialLoginLogos';
import truncate from 'lodash/truncate';

import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';
import FooterContainer from '../../containers/FooterContainer/FooterContainer';
import NotFoundPage from '../../containers/NotFoundPage/NotFoundPage';
import Waveform from '../AudioPlayer/Waveform';

import css from './ProfilePage.module.css';
import { baseUrlSocial } from '../../util/added';
import { baseApiExternalFiles } from '../../util/api';

import VerifiedIconLogo from '../../assets/7641727.png';

const MAX_MOBILE_SCREEN_WIDTH = 768;

const BIO_COLLAPSED_LENGTH = 170;

const truncated = s => {
  return truncate(s, {
    length: BIO_COLLAPSED_LENGTH,

    // Allow truncated text end only in specific characters. This will
    // make the truncated text shorter than the length if the original
    // text has to be shortened and the substring ends in a separator.
    //
    // This ensures that the final text doesn't get cut in the middle
    // of a word.
    separator: /\s|,|\.|:|;/,
    omission: '…',
  });
};

const ExpandableBio = props => {
  const [expand, setExpand] = useState(false);
  const { className, bio } = props;
  const truncatedBio = truncated(bio);

  const handleShowMoreClick = () => {
    setExpand(true);
  };
  const showMore = (
    <InlineTextButton rootClassName={css.showMore} onClick={handleShowMoreClick}>
      <FormattedMessage id="UserCard.showFullBioLink" />
    </InlineTextButton>
  );
  return (
    <p className={className}>
      {expand ? bio : truncatedBio}
      {bio !== truncatedBio && !expand ? showMore : null}
    </p>
  );
};

ExpandableBio.defaultProps = { className: null };

ExpandableBio.propTypes = {
  className: string,
  bio: string.isRequired,
};

export const AsideContent = props => {
  const { user, displayName, isCurrentUser } = props;

  const bio = user?.attributes?.profile?.bio || '';

  const hasBio = !!bio;

  const publicData = user?.attributes?.profile?.publicData || {};

  const openSocialNetWork = (networkName, baseUrl = '') => {
    window.open(publicData[networkName]);
  };

  return (
    <div className={css.asideContent}>
      <div style={{ display: 'flex' }}>
        <AvatarLarge className={css.avatar} user={user} disableProfileLink />
        <H2 as="h3" className={css.mobileHeading}>
          {displayName ? (
            <FormattedMessage
              id="UserCard.instagram"
              values={{ instagram: publicData?.instagram }}
            />
          ) : null}
        </H2>
        <H2 as="h3" className={css.desktopHeading}>
          {displayName}
          {/* <FormattedMessage id="UserCard.instagram" values={{ instagram: publicData?.instagram }} /> */}
        </H2>
        {/* {publicData?.verified == true ? <span>{VerifiedIconLogo}</span> : <></>} */}
        {publicData?.verified == true ? <img width="32px" height="32px" style={{marginRight:"20px"}} src={VerifiedIconLogo}/> : <></>}
        {/* {hasBio ? <ExpandableBio className={css.desktopBio} bio={bio} /> : null} */}
      </div>
      <div style={{ display: 'flex', marginBottom: '2%' }}>
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
          ></Waveform>
        </div>
      )}
    </div>
  );
};

export const ReviewsErrorMaybe = props => {
  const { queryReviewsError } = props;
  return queryReviewsError ? (
    <p className={css.error}>
      <FormattedMessage id="ProfilePage.loadingReviewsFailed" />
    </p>
  ) : null;
};

export const MobileReviews = props => {
  const { reviews, queryReviewsError } = props;
  const reviewsOfProvider = reviews.filter(r => r.attributes.type === REVIEW_TYPE_OF_PROVIDER);
  const reviewsOfCustomer = reviews.filter(r => r.attributes.type === REVIEW_TYPE_OF_CUSTOMER);
  return (
    <div className={css.mobileReviews}>
      <H4 as="h2" className={css.mobileReviewsTitle}>
        <FormattedMessage
          id="ProfilePage.reviewsFromMyCustomersTitle"
          values={{ count: reviewsOfProvider.length }}
        />
      </H4>
      <ReviewsErrorMaybe queryReviewsError={queryReviewsError} />
      <Reviews reviews={reviewsOfProvider} />
      <H4 as="h2" className={css.mobileReviewsTitle}>
        <FormattedMessage
          id="ProfilePage.reviewsAsACustomerTitle"
          values={{ count: reviewsOfCustomer.length }}
        />
      </H4>
      <ReviewsErrorMaybe queryReviewsError={queryReviewsError} />
      <Reviews reviews={reviewsOfCustomer} />
    </div>
  );
};

export const DesktopReviews = props => {
  const [showReviewsType, setShowReviewsType] = useState(REVIEW_TYPE_OF_PROVIDER);
  const { reviews, queryReviewsError } = props;
  const reviewsOfProvider = reviews.filter(r => r.attributes.type === REVIEW_TYPE_OF_PROVIDER);
  const reviewsOfCustomer = reviews.filter(r => r.attributes.type === REVIEW_TYPE_OF_CUSTOMER);
  const isReviewTypeProviderSelected = showReviewsType === REVIEW_TYPE_OF_PROVIDER;
  const isReviewTypeCustomerSelected = showReviewsType === REVIEW_TYPE_OF_CUSTOMER;
  const desktopReviewTabs = [
    {
      text: (
        <Heading as="h3" rootClassName={css.desktopReviewsTitle}>
          <FormattedMessage
            id="ProfilePage.reviewsFromMyCustomersTitle"
            values={{ count: reviewsOfProvider.length }}
          />
        </Heading>
      ),
      selected: isReviewTypeProviderSelected,
      onClick: () => setShowReviewsType(REVIEW_TYPE_OF_PROVIDER),
    },
    {
      text: (
        <Heading as="h3" rootClassName={css.desktopReviewsTitle}>
          <FormattedMessage
            id="ProfilePage.reviewsAsACustomerTitle"
            values={{ count: reviewsOfCustomer.length }}
          />
        </Heading>
      ),
      selected: isReviewTypeCustomerSelected,
      onClick: () => setShowReviewsType(REVIEW_TYPE_OF_CUSTOMER),
    },
  ];

  return (
    <div className={css.desktopReviews}>
      <div className={css.desktopReviewsWrapper}>
        <ButtonTabNavHorizontal className={css.desktopReviewsTabNav} tabs={desktopReviewTabs} />

        <ReviewsErrorMaybe queryReviewsError={queryReviewsError} />

        {isReviewTypeProviderSelected ? (
          <Reviews reviews={reviewsOfProvider} />
        ) : (
          <Reviews reviews={reviewsOfCustomer} />
        )}
      </div>
    </div>
  );
};

export const MainContent = props => {
  const {
    userShowError,
    bio,
    displayName,
    listings,
    queryListingsError,
    reviews,
    queryReviewsError,
    viewport,
  } = props;

  const hasListings = listings.length > 0;
  const isMobileLayout = viewport.width < MAX_MOBILE_SCREEN_WIDTH;
  const hasBio = !!bio;

  const listingsContainerClasses = classNames(css.listingsContainer, {
    [css.withBioMissingAbove]: !hasBio,
  });

  if (userShowError || queryListingsError) {
    return (
      <p className={css.error}>
        <FormattedMessage id="ProfilePage.loadingDataFailed" />
      </p>
    );
  }
  return (
    <div>
      {hasListings ? (
        <div className={listingsContainerClasses}>
          <H4 as="h2" className={css.listingsTitle}>
            <FormattedMessage id="ProfilePage.listingsTitle" values={{ count: listings.length }} />
          </H4>
          <ul className={css.listings}>
            {listings.map(l => (
              <li className={css.listing} key={l.id.uuid}>
                <ListingCard listing={l} showAuthorInfo={false} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {isMobileLayout ? (
        <MobileReviews reviews={reviews} queryReviewsError={queryReviewsError} />
      ) : (
        <DesktopReviews reviews={reviews} queryReviewsError={queryReviewsError} />
      )}
    </div>
  );
};

const ProfilePageComponent = props => {
  const config = useConfiguration();
  const { scrollingDisabled, currentUser, userShowError, user, intl, ...rest } = props;
  const ensuredCurrentUser = ensureCurrentUser(currentUser);
  const profileUser = ensureUser(user);
  const isCurrentUser =
    ensuredCurrentUser.id && profileUser.id && ensuredCurrentUser.id.uuid === profileUser.id.uuid;
  const { bio, displayName } = profileUser?.attributes?.profile || {};

  const schemaTitleVars = { name: displayName, marketplaceName: config.marketplaceName };
  const schemaTitle = intl.formatMessage({ id: 'ProfilePage.schemaTitle' }, schemaTitleVars);

  if (userShowError && userShowError.status === 404) {
    return <NotFoundPage />;
  }
  return (
    <Page
      scrollingDisabled={scrollingDisabled}
      title={schemaTitle}
      schema={{
        '@context': 'http://schema.org',
        '@type': 'ProfilePage',
        name: schemaTitle,
      }}
    >
      <LayoutSideNavigation
        sideNavClassName={css.aside}
        topbar={<TopbarContainer currentPage="ProfilePage" />}
        // sideNav={
        //   <AsideContent user={user} isCurrentUser={isCurrentUser} displayName={displayName} />
        // }
        footer={<FooterContainer />}
      >
        <AsideContent user={user} isCurrentUser={isCurrentUser} displayName={displayName} />
        <MainContent bio={bio} displayName={displayName} userShowError={userShowError} {...rest} />
      </LayoutSideNavigation>
    </Page>
  );
};

ProfilePageComponent.defaultProps = {
  currentUser: null,
  user: null,
  userShowError: null,
  queryListingsError: null,
  reviews: [],
  queryReviewsError: null,
};

ProfilePageComponent.propTypes = {
  scrollingDisabled: bool.isRequired,
  currentUser: propTypes.currentUser,
  user: propTypes.user,
  userShowError: propTypes.error,
  queryListingsError: propTypes.error,
  listings: arrayOf(propTypes.listing).isRequired,
  reviews: arrayOf(propTypes.review),
  queryReviewsError: propTypes.error,

  // form withViewport
  viewport: shape({
    width: number.isRequired,
    height: number.isRequired,
  }).isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  const { currentUser } = state.user;
  const {
    userId,
    userShowError,
    queryListingsError,
    userListingRefs,
    reviews,
    queryReviewsError,
  } = state.ProfilePage;
  const userMatches = getMarketplaceEntities(state, [{ type: 'user', id: userId }]);
  const user = userMatches.length === 1 ? userMatches[0] : null;
  const listings = getMarketplaceEntities(state, userListingRefs);
  return {
    scrollingDisabled: isScrollingDisabled(state),
    currentUser,
    user,
    userShowError,
    queryListingsError,
    listings,
    reviews,
    queryReviewsError,
  };
};

const ProfilePage = compose(
  connect(mapStateToProps),
  withViewport,
  injectIntl
)(ProfilePageComponent);

export default ProfilePage;
