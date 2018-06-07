import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Progress from 'react-progress';
const View = (props) => {
  return (
      <div>
        <Progress percent={props.amount} color="#6AE368"/>
      </div> 
    )
}
export default observer(View)
