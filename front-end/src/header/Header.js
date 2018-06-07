import React, { Component } from 'react';
import './Header.css';
import logo from '../Assets/logo.svg';
import LoggedIn from './LoggedIn';
import LoggedOut from './LoggedOut';
import { observer } from 'mobx-react';
import { Link } from 'react-router';
class Header extends Component {
  render() {
    var child = this.props.stores.user.isLoggedIn
      ? <LoggedIn stores={this.props.stores} />
      : <LoggedOut stores={this.props.stores} />;
    return (
      <div style={{height:'100%'}}>
        <div className="App-header">
        <div className="header-flex-left">
          <Link to="/">
            <img className="logo" src={logo} alt="spin" />
            <span className="beta" style={{color:'white'}}>beta</span>
          </Link>
          </div>
          <div className="App-right">
            {child}
          </div>
        </div>
      </div>
    );
  }
}

export default observer(Header);
