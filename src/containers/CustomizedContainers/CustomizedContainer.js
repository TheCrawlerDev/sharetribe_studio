import React, { Component } from 'react';
import { CustomizedField } from './CustomizedFields/CustomizedField';
export class CustomizedContainer extends Component {
  render() {
    if (this.props.data.content.includes('customized_field_')) {
      return <CustomizedField {...this.props} />;
    } else {
      return <div>That's not customized {this.props.data.content}!</div>;
    }
  }
}

export const isCustomized = props => {
  try {
    if (!props.hasOwnProperty('data')) {
      return false;
    }
    if (props.data.hasOwnProperty('content') && props.data.content.includes('customized_')) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
};
