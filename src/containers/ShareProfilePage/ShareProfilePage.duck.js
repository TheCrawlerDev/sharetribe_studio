import merge from 'lodash/merge';
import { denormalisedResponseEntities } from '../../util/data';
import { storableError } from '../../util/errors';
import { fetchCurrentUser, currentUserShowSuccess } from '../../ducks/user.duck';

// ================ Action types ================ //

export const SAVE_CONTACT_DETAILS_REQUEST = 'app/ContactDetailsPage/SAVE_CONTACT_DETAILS_REQUEST';
export const SAVE_CONTACT_DETAILS_SUCCESS = 'app/ContactDetailsPage/SAVE_CONTACT_DETAILS_SUCCESS';
export const SAVE_EMAIL_ERROR = 'app/ContactDetailsPage/SAVE_EMAIL_ERROR';
export const SAVE_PHONE_NUMBER_ERROR = 'app/ContactDetailsPage/SAVE_PHONE_NUMBER_ERROR';
export const SAVE_GCALENDAR_ERROR = 'app/ContactDetailsPage/SAVE_GCALENDAR_ERROR';
export const SAVE_ICALENDAR_ERROR = 'app/ContactDetailsPage/SAVE_ICALENDAR_ERROR';

export const SAVE_CONTACT_DETAILS_CLEAR = 'app/ContactDetailsPage/SAVE_CONTACT_DETAILS_CLEAR';

export const RESET_PASSWORD_REQUEST = 'app/ContactDetailsPage/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS = 'app/ContactDetailsPage/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_ERROR = 'app/ContactDetailsPage/RESET_PASSWORD_ERROR';

export const G_CALENDAR_TYPE = 'G_CALENDAR';
export const I_CALENDAR_TYPE = 'I_CALENDAR';

// ================ Reducer ================ //

const initialState = {
  saveEmailError: null,
  savePhoneNumberError: null,
  saveContactDetailsInProgress: false,
  contactDetailsChanged: false,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case SAVE_CONTACT_DETAILS_REQUEST:
      return {
        ...state,
        saveContactDetailsInProgress: true,
        saveEmailError: null,
        savePhoneNumberError: null,
        contactDetailsChanged: false,
      };
    case SAVE_CONTACT_DETAILS_SUCCESS:
      return { ...state, saveContactDetailsInProgress: false, contactDetailsChanged: true };
    case SAVE_EMAIL_ERROR:
      return { ...state, saveContactDetailsInProgress: false, saveEmailError: payload };
    case SAVE_PHONE_NUMBER_ERROR:
      return { ...state, saveContactDetailsInProgress: false, savePhoneNumberError: payload };

    case SAVE_CONTACT_DETAILS_CLEAR:
      return {
        ...state,
        saveContactDetailsInProgress: false,
        saveEmailError: null,
        savePhoneNumberError: null,
        contactDetailsChanged: false,
      };

    case RESET_PASSWORD_REQUEST:
      return { ...state, resetPasswordInProgress: true, resetPasswordError: null };
    case RESET_PASSWORD_SUCCESS:
      return { ...state, resetPasswordInProgress: false };
    case RESET_PASSWORD_ERROR:
      console.error(payload); // eslint-disable-line no-console
      return { ...state, resetPasswordInProgress: false, resetPasswordError: payload };

    default:
      return state;
  }
}

// ================ Action creators ================ //

export const saveContactDetailsRequest = () => ({ type: SAVE_CONTACT_DETAILS_REQUEST });
export const saveContactDetailsSuccess = () => ({ type: SAVE_CONTACT_DETAILS_SUCCESS });
export const saveEmailError = error => ({
  type: SAVE_EMAIL_ERROR,
  payload: error,
  error: true,
});
export const savePhoneNumberError = error => ({
  type: SAVE_PHONE_NUMBER_ERROR,
  payload: error,
  error: true,
});

export const saveContactDetailsClear = () => ({ type: SAVE_CONTACT_DETAILS_CLEAR });

export const resetPasswordRequest = () => ({ type: RESET_PASSWORD_REQUEST });

export const resetPasswordSuccess = () => ({ type: RESET_PASSWORD_SUCCESS });

export const resetPasswordError = e => ({
  type: RESET_PASSWORD_ERROR,
  error: true,
  payload: e,
});

// ================ Thunks ================ //

/**
 * Make a phone number update request to the API and return the current user.
 */
const requestSavePhoneNumber = params => (dispatch, getState, sdk) => {
  const phoneNumber = params.phoneNumber;

  return sdk.currentUser
    .updateProfile(
      { protectedData: { phoneNumber } },
      {
        expand: true,
        include: ['profileImage'],
        'fields.image': ['variants.square-small', 'variants.square-small2x'],
      }
    )
    .then(response => {
      const entities = denormalisedResponseEntities(response);
      if (entities.length !== 1) {
        throw new Error('Expected a resource in the sdk.currentUser.updateProfile response');
      }

      const currentUser = entities[0];
      return currentUser;
    })
    .catch(e => {
      dispatch(savePhoneNumberError(storableError(e)));
      // pass the same error so that the SAVE_CONTACT_DETAILS_SUCCESS
      // action will not be fired
      throw e;
    });
};

const requestGCalendar = params => (dispatch, getState, sdk) => {
  const gCalendar = params.gCalendar;
  const protectedData = params.protectedData;

  return sdk.currentUser
    .updateProfile(
      { protectedData: { ...protectedData, gCalendar } },
      {
        expand: true,
        include: ['profileImage'],
        'fields.image': ['variants.square-small', 'variants.square-small2x'],
      }
    )
    .then(response => {
      const entities = denormalisedResponseEntities(response);
      if (entities.length !== 1) {
        throw new Error('Expected a resource in the sdk.currentUser.updateProfile response');
      }

      const currentUser = entities[0];
      return currentUser;
    })
    .catch(e => {
      // dispatch(savePhoneNumberError(storableError(e)));
      dispatch({
        type: SAVE_GCALENDAR_ERROR,
        payload: storableError(e),
        error: true,
      });
      // pass the same error so that the SAVE_CONTACT_DETAILS_SUCCESS
      // action will not be fired
      throw e;
    });
};

const requestICalendar = params => (dispatch, getState, sdk) => {
  const iCalendar = params.iCalendar;
  const protectedData = params.protectedData;

  return sdk.currentUser
    .updateProfile(
      { protectedData: { ...protectedData, iCalendar } },
      {
        expand: true,
        include: ['profileImage'],
        'fields.image': ['variants.square-small', 'variants.square-small2x'],
      }
    )
    .then(response => {
      const entities = denormalisedResponseEntities(response);
      if (entities.length !== 1) {
        throw new Error('Expected a resource in the sdk.currentUser.updateProfile response');
      }

      const currentUser = entities[0];
      return currentUser;
    })
    .catch(e => {
      // dispatch(savePhoneNumberError(storableError(e)));
      dispatch({
        type: SAVE_ICALENDAR_ERROR,
        payload: storableError(e),
        error: true,
      });
      // pass the same error so that the SAVE_CONTACT_DETAILS_SUCCESS
      // action will not be fired
      throw e;
    });
};

/**
 * Make a email update request to the API and return the current user.
 */
const requestSaveEmail = params => (dispatch, getState, sdk) => {
  const { email, currentPassword } = params;

  return sdk.currentUser
    .changeEmail(
      { email, currentPassword },
      {
        expand: true,
        include: ['profileImage'],
        'fields.image': ['variants.square-small', 'variants.square-small2x'],
      }
    )
    .then(response => {
      const entities = denormalisedResponseEntities(response);
      if (entities.length !== 1) {
        throw new Error('Expected a resource in the sdk.currentUser.changeEmail response');
      }

      const currentUser = entities[0];
      return currentUser;
    })
    .catch(e => {
      dispatch(saveEmailError(storableError(e)));
      // pass the same error so that the SAVE_CONTACT_DETAILS_SUCCESS
      // action will not be fired
      throw e;
    });
};

const saveGCalendar = params => (dispatch, getState, sdk) => {
  return (
    dispatch(requestGCalendar(params))
      .then(user => {
        dispatch(currentUserShowSuccess(user));
        dispatch(saveContactDetailsSuccess());
      })
      // error action dispatched in requestSaveEmail
      .catch(e => null)
  );
};

const saveICalendar = params => (dispatch, getState, sdk) => {
  return (
    dispatch(requestICalendar(params))
      .then(user => {
        dispatch(currentUserShowSuccess(user));
        dispatch(saveContactDetailsSuccess());
      })
      // error action dispatched in requestSaveEmail
      .catch(e => null)
  );
};

/**
 * Save email and update the current user.
 */
const saveEmail = params => (dispatch, getState, sdk) => {
  return (
    dispatch(requestSaveEmail(params))
      .then(user => {
        dispatch(currentUserShowSuccess(user));
        dispatch(saveContactDetailsSuccess());
      })
      // error action dispatched in requestSaveEmail
      .catch(e => null)
  );
};

/**
 * Save phone number and update the current user.
 */
const savePhoneNumber = params => (dispatch, getState, sdk) => {
  return (
    dispatch(requestSavePhoneNumber(params))
      .then(user => {
        dispatch(currentUserShowSuccess(user));
        dispatch(saveContactDetailsSuccess());
      })
      // error action dispatched in requestSavePhoneNumber
      .catch(e => null)
  );
};

/**
 * Save email and phone number and update the current user.
 */
const saveEmailAndPhoneNumber = params => (dispatch, getState, sdk) => {
  const { email, phoneNumber, currentPassword } = params;

  // order of promises: 1. email, 2. phone number
  const promises = [
    dispatch(requestSaveEmail({ email, currentPassword })),
    dispatch(requestSavePhoneNumber({ phoneNumber })),
  ];

  return Promise.all(promises)
    .then(values => {
      // Array of two user objects is resolved
      // the first one is from the email update
      // the second one is from the phone number update

      const saveEmailUser = values[0];
      const savePhoneNumberUser = values[1];

      // merge the protected data from the user object returned
      // by the phone update operation
      const protectedData = savePhoneNumberUser.attributes.profile.protectedData;
      const phoneNumberMergeSource = { attributes: { profile: { protectedData } } };

      const currentUser = merge(saveEmailUser, phoneNumberMergeSource);
      dispatch(currentUserShowSuccess(currentUser));
      dispatch(saveContactDetailsSuccess());
    })
    .catch(e => null);
};

/**
 * Update contact details, actions depend on which data has changed
 */
export const saveCalendarDetails = params => (dispatch, getState, sdk) => {
  dispatch(saveContactDetailsRequest());

  const { gCalendar, iCalendar, type, protectedData } = params;

  if (type == G_CALENDAR_TYPE) {
    return dispatch(saveGCalendar({ gCalendar, protectedData }));
  } else if (type == I_CALENDAR_TYPE) {
    return dispatch(saveICalendar({ iCalendar, protectedData }));
  }
};

export const resetPassword = email => (dispatch, getState, sdk) => {
  dispatch(resetPasswordRequest());
  return sdk.passwordReset
    .request({ email })
    .then(() => dispatch(resetPasswordSuccess()))
    .catch(e => dispatch(resetPasswordError(storableError(e))));
};

export const loadData = () => {
  // Since verify email happens in separate tab, current user's data might be updated
  return fetchCurrentUser({
    include: ['profile'],
    'fields.image': [
      'variants.square-small',
      'variants.square-small2x',
      'variants.square-xsmall',
      'variants.square-xsmall2x',
    ],
  });
};
