import React from 'react';
import { observer } from 'mobx-react';
const LoggedOut = props => (
    <div className="flex-row-header">
    <a
      href="#"
      style={{ backgroundColor: '#6D15E6', color: 'white' }}
      onClick={() => props.stores.user.logUserIn()}
      className="button button-pill button-small"
    >
      Login
    </a>
  </div>
);
export default observer(LoggedOut);
