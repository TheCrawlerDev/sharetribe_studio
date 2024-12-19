import React from 'react';

import { FormattedMessage } from '../../../../util/reactIntl';

import { H2 } from '../../../../components';

/**
 * Error messages (e.g. invalidExistingListingType and noListingTypesSet)
 * @param {object} props
 * @returns JSX element containing the error message
 */
const ErrorMessage = props => {
  const { invalidExistingListingType, noListingTypesSet, marketplaceName } = props;
  return invalidExistingListingType ? (
    <div>
      <H2>
        <FormattedMessage id="EditListingAddOnsPanel.invalidListingTypeSetTitle" />
      </H2>
      <p>
        <FormattedMessage
          id="EditListingAddOnsPanel.invalidListingTypeSetDescription"
          values={{ marketplaceName }}
        />
      </p>
    </div>
  ) : noListingTypesSet ? (
    <div>
      <H2>
        <FormattedMessage id="EditListingAddOnsPanel.noListingTypeSetTitle" />
      </H2>
      <p>
        <FormattedMessage id="EditListingAddOnsPanel.noListingTypeSetDescription" />
      </p>
    </div>
  ) : null;
};

export default ErrorMessage;
