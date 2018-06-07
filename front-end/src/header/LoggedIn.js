import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router';
import placeholder from '../Assets/placeholder-avatar.png';
const LoggedIn = props => {
  var displayName = props.stores.user.userObj.display_name &&
    props.stores.user.userObj.display_name !== 'null'
    ? props.stores.user.userObj.display_name.split(' ')[0]
    : props.stores.user.userObj.id;
  var src = props.stores.user.userObj['images[0][url]']
    ? props.stores.user.userObj['images[0][url]']
    : placeholder;
  return (
    <div className="flex-row-header">
      <div className="user-image-flex">
        <img alt="" className="user-image" src={src} />
      </div>
      <div className="user-name-flex">
        <div className="dropdown">
          <p data-toggle="dropdown" className="dropdown-toggle noMarg cursor">
            {displayName}
          </p>
          <ul className="dropdown-menu">
            <li>
              <a href="#" onClick={() => props.stores.user.logUserOut()}>
                logout
              </a>
              <Link to="faq">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default observer(LoggedIn);
