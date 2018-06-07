import React, { Component } from 'react';
import '../App/App.css';
import { observer } from 'mobx-react';
class Login extends Component {
  componentWillMount() {
    this.props.route.stores.user.isUserLogged();
    if (this.props.location.query.spinToken) {
      this.props.route.stores.user.recievedUserData(this.props.location.query);
    }
  }
  render() {
    return (
      <div className="wrapper">
        <div className="mainContent">
          <this.props.route.child />
        </div>
      </div>
    );
  }
}
export default observer(Login);
