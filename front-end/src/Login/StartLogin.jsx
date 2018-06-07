import { Component } from 'react';
import { observer } from 'mobx-react';
class StartLogin extends Component {
  componentWillMount() {
    this.props.route.stores.user.logUserIn();
  }
}
export default observer(StartLogin);
