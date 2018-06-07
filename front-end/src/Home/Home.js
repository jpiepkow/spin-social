import React, { Component } from 'react';
import { observer } from 'mobx-react';
import './Home.css';
import Top from './top';
import Info from './info';

class Home extends Component {
  render() {
    return (
      <div className="mainContainer">
        <Top />
        <Info />
      </div>
    );
  }
}
export default observer(Home);
