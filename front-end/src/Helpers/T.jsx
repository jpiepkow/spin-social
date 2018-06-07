import React from 'react';
import Timer from 'react.timer';
import { observer } from 'mobx-react';

class T extends React.Component {
  render() {
    return (
      <div key={this.props.uuid} className="timerFont">
        <Timer countDown startTime={this.props.time} />
      </div>
    );
  }
}
export default observer(T);
