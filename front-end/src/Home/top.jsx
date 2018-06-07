import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router';
import './Home.css';

class Top extends Component {
  render() {
    return (
      <div className="bgimg">
        <div className="content">
          <div className="row half center">
            <div className="col-md-12 solidOne">
              <p>start spinning today.</p>
            </div>
          </div>
          <div className="flex-row-top startSpinning">
            <div className="flex-button solidTwo">
              <Link
                to="/startplaylist/nameparty"
                style={{ backgroundColor: '#6D15E6', color: 'white' }}
                onClick={() => {
                }}
                className="button button-pill button-giant buttonOne"
              >
                <p className="lt">START A SPIN PLAYLIST</p>
              </Link>
            </div>
            <div className="flex-button flex-two solidTwo buttonTwo">
              <Link
                to="joinplaylist"
                style={{ backgroundColor: '#6D15E6', color: 'white' }}
                onClick={() => {
                }}
                className="button button-pill button-giant buttonTwo"
              >
                <p className="lt">JOIN A SPIN PLAYLIST</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default observer(Top);
