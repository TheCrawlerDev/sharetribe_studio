import React, { Component, useState, useEffect } from 'react';
import { bool, string } from 'prop-types';
import { compose } from 'redux';
import { Field, Form as FinalForm } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';

import { FormattedMessage, injectIntl, intlShape } from '../../../util/reactIntl';
import { ensureCurrentUser } from '../../../util/data';
import { propTypes } from '../../../util/types';
import * as validators from '../../../util/validators';
import { isUploadImageOverLimitError } from '../../../util/errors';
import {
  Form,
  Avatar,
  Button,
  ImageFromFile,
  IconSpinner,
  FieldTextInput,
  H4,
  AspectRatioWrapper,
  Modal,
} from '../../../components';
import DiscordIconPng from '../../../assets/discord.png';
import css from './ProfileSettingsForm.module.css';
import { baseApiExternalFiles, createProfileSong, createQrCode } from '../../../util/api';
import Waveform from '../../AudioPlayer/Waveform';
import { SubscriptionPlansEnum } from '../../SubscriptionsPlansPage/SubscriptionsPlans.enum';

const ACCEPT_IMAGES = 'image/*';
const UPLOAD_CHANGE_DELAY = 2000; // Show spinner so that browser has time to load img srcset

const FieldAddSong = props => {
  const { user, formApi, onSongUploadHandler, aspectWidth = 1, aspectHeight = 1, ...rest } = props;

  const [songLabel, setSongLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertError, setAlertError] = useState(false);
  const [alertErrorMessage, setAlertErrorMessage] = useState('');

  return (
    <Field form={null} {...rest} songLabel={songLabel} setSongLabel={setSongLabel}>
      {fieldProps => {
        const { accept, input, label, disabled: fieldDisabled } = fieldProps;
        const { name, type } = input;
        const onChange = e => {
          if (songLabel.length < 1) {
            setAlertErrorMessage('Please enter the song name first and upload the song then.');
            setLoading(false);
            return setAlertError(true);
          }
          const file = e.target.files[0];
          let form = new FormData();
          form.append('fileUpload', event.target.files[0]);
          if (file != null) {
            setLoading(true);
            createProfileSong(user.id.uuid, form)
              .then(response => {
                return response.json();
              })
              .then(response => {
                let song = { ...response.data, label: songLabel };
                onSongUploadHandler(song);
                fieldProps.setSong(song);
                fieldProps.setSongInput(false);
                setLoading(false);
              })
              .catch(error => {
                setAlertErrorMessage("We can't proccess your file. Please try again with another.");
                setAlertError(true);
                setLoading(false);
                console.log('error', error);
              });
          } else {
            setAlertErrorMessage("We can't proccess your file, because it's null.");
            setAlertError(true);
            setLoading(false);
          }
        };
        const inputProps = { accept, id: name, name, onChange, type };

        return (
          <div className={css.addImageWrapper}>
            <Modal
              {...props}
              isOpen={alertError}
              onClose={() => {
                setAlertError(false);
              }}
              onManageDisableScrolling={() => {}}
            >
              <div style={{ margin: '1rem' }}>{alertErrorMessage}</div>
            </Modal>
            {loading ? (
              <>
                <span className={css.loader}></span>
                <label>We are processing your request, please wait!</label>
              </>
            ) : (
              <>
                <FieldTextInput
                  className={css.mb4pct}
                  type="text"
                  id="song_label"
                  name="song_label"
                  label="Song Name"
                  placeholder="Type the name of your song"
                />
                <OnChange name="song_label">
                  {(value, previous) => {
                    setSongLabel(value);
                  }}
                </OnChange>
                <AspectRatioWrapper
                  style={{ marginBottom: '100px' }}
                  width={aspectWidth}
                  height={aspectHeight}
                >
                  <input {...inputProps} className={css.addImageInput} />
                  <label htmlFor={name} className={css.addImage}>
                    {label}
                  </label>
                </AspectRatioWrapper>
              </>
            )}
          </div>
        );
      }}
    </Field>
  );
};

const FieldPreviewAndRemoveSong = props => {
  const { user, formApi, onSongUploadHandler, aspectWidth = 1, aspectHeight = 1, ...rest } = props;

  return (
    <Field form={null} {...rest}>
      {fieldProps => {
        const removeSong = () => {
          onSongUploadHandler(false);
          fieldProps.setSongInput(true);
        };

        return (
          <>
            <label>Song Preview</label>
            <div className={css.WaveAudio}>
              <Waveform
                url={fieldProps?.song?.Location}
                height="50"
                label={fieldProps?.song?.label}
              ></Waveform>
            </div>
            <Button className={css.submitButton} onClick={removeSong} type="button">
              Remove Song
            </Button>
          </>
        );
      }}
    </Field>
  );
};

class ProfileSettingsFormComponent extends Component {
  constructor(props) {
    super(props);

    this.uploadDelayTimeoutId = null;
    this.state = { uploadDelay: false };
    this.submittedValues = {};
  }

  componentDidUpdate(prevProps) {
    // Upload delay is additional time window where Avatar is added to the DOM,
    // but not yet visible (time to load image URL from srcset)
    if (prevProps.uploadInProgress && !this.props.uploadInProgress) {
      this.setState({ uploadDelay: true });
      this.uploadDelayTimeoutId = window.setTimeout(() => {
        this.setState({ uploadDelay: false });
      }, UPLOAD_CHANGE_DELAY);
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.uploadDelayTimeoutId);
  }

  render() {
    return (
      <FinalForm
        {...this.props}
        render={fieldRenderProps => {
          const {
            className,
            currentUser,
            handleSubmit,
            onChangeProfileSong,
            intl,
            invalid,
            onImageUpload,
            pristine,
            profileImage,
            rootClassName,
            updateInProgress,
            updateProfileError,
            uploadImageError,
            uploadInProgress,
            form,
            marketplaceName,
            values,
          } = fieldRenderProps;

          const user = ensureCurrentUser(currentUser);

          const [qrCode, setQrCode] = useState(null);

          const [song, setSong] = useState(user?.attributes?.profile?.publicData?.song);

          const [songInput, setSongInput] = useState(
            !user?.attributes?.profile?.publicData?.song?.Location
          );

          let plan = user.attributes.profile.publicData?.subscription_paywall
            ? user.attributes.profile.publicData?.subscription_paywall?.plan
            : SubscriptionPlansEnum.FREE;

          let premiumPlan = plan == SubscriptionPlansEnum.FREE ? false : true;

          useEffect(() => {
            let key = 'myStudioBookQrCode';
            let storedQrCode = localStorage.getItem(key);
            if (storedQrCode) {
              setQrCode(storedQrCode);
            } else {
              createQrCode(window.location.origin, user.id.uuid).then(result => {
                setQrCode(result.qr);
                localStorage.setItem(key, result.qr);
              });
            }
          }, []);

          // First name
          const firstNameLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.firstNameLabel',
          });
          const firstNamePlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.firstNamePlaceholder',
          });
          const firstNameRequiredMessage = intl.formatMessage({
            id: 'ProfileSettingsForm.firstNameRequired',
          });
          const firstNameRequired = validators.required(firstNameRequiredMessage);

          // Last name
          const lastNameLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.lastNameLabel',
          });
          const lastNamePlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.lastNamePlaceholder',
          });
          const lastNameRequiredMessage = intl.formatMessage({
            id: 'ProfileSettingsForm.lastNameRequired',
          });
          const lastNameRequired = validators.required(lastNameRequiredMessage);

          // Bio
          const bioLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.bioLabel',
          });
          const bioPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.bioPlaceholder',
          });

          // Social Network
          const websiteLinkLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.websiteLink',
          });
          const instagramLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.instagram',
          });
          const spotifyLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.spotify',
          });
          const appleMusicLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.appleMusic',
          });
          const soundcloudLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.soundcloud',
          });
          const tidalLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.tidal',
          });
          const bandcampLabel = intl.formatMessage({
            id: 'ProfileSettingsForm.bandcamp',
          });
          const websiteLinkPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.websiteLinkPlaceholder',
          });
          const instagramPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.instagramPlaceholder',
          });
          const spotifyPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.spotifyPlaceholder',
          });
          const appleMusicPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.appleMusicPlaceholder',
          });
          const soundcloudPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.soundcloudPlaceholder',
          });
          const tidalPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.tidalPlaceholder',
          });
          const bandcampPlaceholder = intl.formatMessage({
            id: 'ProfileSettingsForm.bandcampPlaceholder',
          });

          const uploadingOverlay =
            uploadInProgress || this.state.uploadDelay ? (
              <div className={css.uploadingImageOverlay}>
                <IconSpinner />
              </div>
            ) : null;

          const hasUploadError = !!uploadImageError && !uploadInProgress;
          const errorClasses = classNames({ [css.avatarUploadError]: hasUploadError });
          const transientUserProfileImage = profileImage.uploadedImage || user.profileImage;
          const transientUser = { ...user, profileImage: transientUserProfileImage };

          // Ensure that file exists if imageFromFile is used
          const fileExists = !!profileImage.file;
          const fileUploadInProgress = uploadInProgress && fileExists;
          const delayAfterUpload = profileImage.imageId && this.state.uploadDelay;
          const imageFromFile =
            fileExists && (fileUploadInProgress || delayAfterUpload) ? (
              <ImageFromFile
                id={profileImage.id}
                className={errorClasses}
                rootClassName={css.uploadingImage}
                aspectWidth={1}
                aspectHeight={1}
                file={profileImage.file}
              >
                {uploadingOverlay}
              </ImageFromFile>
            ) : null;

          // Avatar is rendered in hidden during the upload delay
          // Upload delay smoothes image change process:
          // responsive img has time to load srcset stuff before it is shown to user.
          const avatarClasses = classNames(errorClasses, css.avatar, {
            [css.avatarInvisible]: this.state.uploadDelay,
          });
          const avatarComponent =
            !fileUploadInProgress && profileImage.imageId ? (
              <Avatar
                className={avatarClasses}
                renderSizes="(max-width: 767px) 96px, 240px"
                user={transientUser}
                disableProfileLink
              />
            ) : null;

          const chooseAvatarLabel =
            profileImage.imageId || fileUploadInProgress ? (
              <div className={css.avatarContainer}>
                {imageFromFile}
                {avatarComponent}
                <div className={css.changeAvatar}>
                  <FormattedMessage id="ProfileSettingsForm.changeAvatar" />
                </div>
              </div>
            ) : (
              <div className={css.avatarPlaceholder}>
                <div className={css.avatarPlaceholderText}>
                  <FormattedMessage id="ProfileSettingsForm.addYourProfilePicture" />
                </div>
                <div className={css.avatarPlaceholderTextMobile}>
                  <FormattedMessage id="ProfileSettingsForm.addYourProfilePictureMobile" />
                </div>
              </div>
            );

          const submitError = updateProfileError ? (
            <div className={css.error}>
              <FormattedMessage id="ProfileSettingsForm.updateProfileFailed" />
            </div>
          ) : null;

          const classes = classNames(rootClassName || css.root, className);
          const submitInProgress = updateInProgress;
          const submittedOnce = Object.keys(this.submittedValues).length > 0;
          const pristineSinceLastSubmit = submittedOnce && isEqual(values, this.submittedValues);
          const submitDisabled =
            invalid || pristine || pristineSinceLastSubmit || uploadInProgress || submitInProgress;

          return (
            <Form
              className={classes}
              onSubmit={e => {
                this.submittedValues = values;
                handleSubmit(e);
              }}
            >
              <div className={css.sectionContainer}>
                {!!premiumPlan ? (
                  <>
                    <H4 as="h2" className={css.sectionTitle}>
                      <FormattedMessage id="ProfileSettingsForm.inviteToDiscordTitle" />
                    </H4>
                    <Button
                      className={`${css.submitButton} ${css.qrCode} ${css.inviteToDiscordButton}`}
                      style={{
                        backgroundImage: `url(${DiscordIconPng})`,
                        backgroundSize: '195px 37px',
                        backgroundPosition: 'center center',
                        backgroundColor: '#5865F2',
                      }}
                      onClick={() => {
                        window.open('https://discord.gg/EQtByy6g', '_blank');
                      }}
                    >
                      {/* <span className={css.buttonIcon}>{DiscordIconLogo}</span> */}
                      {/* <img src= alt="Red dot" /> */}
                      {/* <FormattedMessage id="ProfileSettingsForm.inviteToDiscordButton" /> */}
                    </Button>
                  </>
                ) : null}
                {/* <H4 as="h2" className={css.sectionTitle}>
                  <FormattedMessage id="ProfileSettingsForm.qrCode" />
                </H4>
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
                    <a href={qrCode} download="studiobook-profile-qrcode.png">
                      If your download doesn't work click here
                    </a>
                  </>
                ) : null} */}
                <H4 as="h2" className={css.sectionTitle}>
                  <FormattedMessage id="ProfileSettingsForm.yourProfilePicture" />
                </H4>
                <Field
                  accept={ACCEPT_IMAGES}
                  id="profileImage"
                  name="profileImage"
                  label={chooseAvatarLabel}
                  type="file"
                  form={null}
                  uploadImageError={uploadImageError}
                  disabled={uploadInProgress}
                >
                  {fieldProps => {
                    const { accept, id, input, label, disabled, uploadImageError } = fieldProps;
                    const { name, type } = input;
                    const onChange = e => {
                      const file = e.target.files[0];
                      form.change(`profileImage`, file);
                      form.blur(`profileImage`);
                      if (file != null) {
                        const tempId = `${file.name}_${Date.now()}`;
                        onImageUpload({ id: tempId, file });
                      }
                    };

                    let error = null;

                    if (isUploadImageOverLimitError(uploadImageError)) {
                      error = (
                        <div className={css.error}>
                          <FormattedMessage id="ProfileSettingsForm.imageUploadFailedFileTooLarge" />
                        </div>
                      );
                    } else if (uploadImageError) {
                      error = (
                        <div className={css.error}>
                          <FormattedMessage id="ProfileSettingsForm.imageUploadFailed" />
                        </div>
                      );
                    }

                    return (
                      <div className={css.uploadAvatarWrapper}>
                        <label className={css.label} htmlFor={id}>
                          {label}
                        </label>
                        <input
                          accept={accept}
                          id={id}
                          name={name}
                          className={css.uploadAvatarInput}
                          disabled={disabled}
                          onChange={onChange}
                          type={type}
                        />
                        {error}
                      </div>
                    );
                  }}
                </Field>
                <div className={css.tip}>
                  <FormattedMessage id="ProfileSettingsForm.tip" />
                </div>
                <div className={css.fileInfo}>
                  <FormattedMessage id="ProfileSettingsForm.fileInfo" />
                </div>
              </div>
              <div className={css.sectionContainer}>
                <H4 as="h2" className={css.sectionTitle}>
                  <FormattedMessage id="ProfileSettingsForm.yourName" />
                </H4>
                <div className={css.nameContainer}>
                  <FieldTextInput
                    className={css.firstName}
                    type="text"
                    id="firstName"
                    name="firstName"
                    label={firstNameLabel}
                    placeholder={firstNamePlaceholder}
                    validate={firstNameRequired}
                  />
                  <FieldTextInput
                    className={css.lastName}
                    type="text"
                    id="lastName"
                    name="lastName"
                    label={lastNameLabel}
                    placeholder={lastNamePlaceholder}
                    validate={lastNameRequired}
                  />
                </div>
              </div>
              <div className={classNames(css.sectionContainer, css.lastSection)}>
                <H4 as="h2" className={css.sectionTitle}>
                  <FormattedMessage id="ProfileSettingsForm.bioHeading" />
                </H4>
                <FieldTextInput
                  type="textarea"
                  id="bio"
                  name="bio"
                  label={bioLabel}
                  placeholder={bioPlaceholder}
                />
                <p className={css.bioInfo}>
                  <FormattedMessage id="ProfileSettingsForm.bioInfo" values={{ marketplaceName }} />
                </p>
              </div>
              {/* new components */}

              <div className={classNames(css.sectionContainer, css.lastSection)}>
                <H4 as="h2" className={css.sectionTitle}>
                  Your Song Preview
                </H4>

                {songInput ? (
                  <FieldAddSong
                    id="profileSong"
                    name="profileSong"
                    accept={'.mp3'}
                    onSongUploadHandler={onChangeProfileSong}
                    label={
                      <span className={css.chooseImageText}>
                        <span className={css.chooseImage}>+ Add a Song</span>
                        <span className={css.imageTypes}>Only accepts .MP3</span>
                      </span>
                    }
                    type="file"
                    user={user}
                    song={song}
                    setSong={setSong}
                    songInput={songInput}
                    setSongInput={setSongInput}
                    disabled={false}
                    aspectWidth={10}
                    aspectHeight={1}
                  />
                ) : (
                  <FieldPreviewAndRemoveSong
                    onSongUploadHandler={onChangeProfileSong}
                    user={user}
                    song={song}
                    setSong={setSong}
                    songInput={songInput}
                    setSongInput={setSongInput}
                    aspectWidth={10}
                    aspectHeight={10}
                  />
                )}
              </div>

              {/* new form */}

              <div className={classNames(css.sectionContainer, css.lastSection)}>
                <H4 as="h2" className={css.sectionTitle}>
                  <FormattedMessage id="ProfileSettingsForm.socialHeading" />
                </H4>
                <FieldTextInput
                  className={css.mb4pct}
                  type="text"
                  id="spotify"
                  name="spotify"
                  label={spotifyLabel}
                  placeholder={spotifyPlaceholder}
                />
                <FieldTextInput
                  className={css.mb4pct}
                  type="text"
                  id="appleMusic"
                  name="appleMusic"
                  label={appleMusicLabel}
                  placeholder={appleMusicPlaceholder}
                />
                <FieldTextInput
                  className={css.mb4pct}
                  type="text"
                  id="soundcloud"
                  name="soundcloud"
                  label={soundcloudLabel}
                  placeholder={soundcloudPlaceholder}
                />
                <FieldTextInput
                  className={css.mb4pct}
                  type="text"
                  id="tidal"
                  name="tidal"
                  label={tidalLabel}
                  placeholder={tidalPlaceholder}
                />
                <FieldTextInput
                  className={css.mb4pct}
                  type="text"
                  id="bandcamp"
                  name="bandcamp"
                  label={bandcampLabel}
                  placeholder={bandcampPlaceholder}
                />
              </div>

              {/* new components */}
              {submitError}
              <Button
                className={css.submitButton}
                type="submit"
                inProgress={submitInProgress}
                disabled={submitDisabled}
                ready={pristineSinceLastSubmit}
              >
                <FormattedMessage id="ProfileSettingsForm.saveChanges" />
              </Button>
            </Form>
          );
        }}
      />
    );
  }
}

ProfileSettingsFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  uploadImageError: null,
  updateProfileError: null,
  updateProfileReady: false,
};

ProfileSettingsFormComponent.propTypes = {
  rootClassName: string,
  className: string,

  uploadImageError: propTypes.error,
  uploadInProgress: bool.isRequired,
  updateInProgress: bool.isRequired,
  updateProfileError: propTypes.error,
  updateProfileReady: bool,

  // from injectIntl
  intl: intlShape.isRequired,
};

const ProfileSettingsForm = compose(injectIntl)(ProfileSettingsFormComponent);

ProfileSettingsForm.displayName = 'ProfileSettingsForm';

export default ProfileSettingsForm;
