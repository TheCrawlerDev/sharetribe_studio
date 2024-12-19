import React from 'react';
import { FormattedMessage, intlShape } from '../../util/reactIntl';
import { LINE_ITEM_NIGHT, LINE_ITEM_DAY, propTypes, LINE_ITEM_HOUR } from '../../util/types';

import css from './OrderBreakdown.module.css';

const LineItemAddOnsMaybe = props => {
  const { lineItems, code, intl } = props;
  const isNightly = code === LINE_ITEM_NIGHT;
  const isDaily = code === LINE_ITEM_DAY;
  const isHourly = code === LINE_ITEM_HOUR;
  const translationKey = isNightly
    ? 'OrderBreakdown.baseUnitNight'
    : isDaily
    ? 'OrderBreakdown.baseUnitDay'
    : isHourly
    ? 'OrderBreakdown.baseUnitHour'
    : 'OrderBreakdown.baseUnitQuantity';

  // Find correct line-item for given code prop.
  // It should be one of the following: 'line-item/night, 'line-item/day', 'line-item/hour', or 'line-item/item'
  // These are defined in '../../util/types';
  const unitPurchase = lineItems.find(item => item.code === code && !item.reversal);
  const quantity = unitPurchase ? unitPurchase.quantity.toString() : null;
  const addOns = unitPurchase?.addOns;

  return !!addOns && addOns.length > 0
    ? addOns.map(addOn => (
        <div className={css.lineItem}>
          <span className={css.itemLabel}>
            {/* <FormattedMessage id={translationKey} values={{ unitPrice: addOn.label, quantity }} /> */}
            {addOn.label}
          </span>
          <span className={css.itemValue}>${parseInt(addOn.value) * parseInt(quantity)}.00</span>
        </div>
      ))
    : null;
};

LineItemAddOnsMaybe.propTypes = {
  lineItems: propTypes.lineItems.isRequired,
  code: propTypes.lineItemUnitType.isRequired,
  intl: intlShape.isRequired,
};

export default LineItemAddOnsMaybe;
