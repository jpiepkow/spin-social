import React, { Component } from 'react';
import './App.css';
import Header from '../header/Header';
import Footer from '../Footer/Footer';
//import DevTools from 'mobx-react-devtools';
import Notifications from 'react-notify-toast-fix';
import { observer } from 'mobx-react';
// import Progress from '../Helpers/Progress';

class App extends Component {
  componentWillMount() {
    this.updateDimensions()
    this.props.route.stores.user.isUserLogged();
  }
  updateDimensions() {
    this.props.route.stores.uiStore.setScreenSize(window.innerWidth,window.innerHeight);
  }
  updateStorage() {
    this.props.route.stores.user.updateStore();
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
    window.addEventListener("storage", this.updateStorage.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
    window.removeEventListener("storage", this.updateStorage.bind(this));
  }
  render() {
    return (
      <div className="wrapper">
        <Notifications />
        <div className="headerSize">
          <Header stores={this.props.route.stores} />
        </div>
        <div className="mainContent">
          {this.props.children}
        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    );
  }
}

export default observer(App);
