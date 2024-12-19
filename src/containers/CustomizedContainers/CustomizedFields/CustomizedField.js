import React, { Component } from 'react';
import { customizedBlocks, notFoundCustomizedBlock } from './CustomizedFields';

export class CustomizedField extends Component {
  render() {
    if(! (this.props.hasOwnProperty('data') && this.props.data.hasOwnProperty('content'))){
      return notConfiguredCustomizedBlock.component;
    }
    const result = customizedBlocks.find(c => c.id === this.props.data.content.split('customized_field_')[1]);
    if (!(result?.valid === true)) {
      return notFoundCustomizedBlock.component;
    }
    return result.component;
  }
}
