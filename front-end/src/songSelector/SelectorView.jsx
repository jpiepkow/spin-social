import React from 'react';
import { observer } from 'mobx-react';
import './Selector.css';
import { Link, browserHistory } from 'react-router';
const SelectorView = props => {
  var style = props.height ? { height: props.height } : {};
  var isEnter = (e) => {
    if(e.key === 'Enter') {
      if(props.submitAction) {
        props.submitAction()
        if(props.to) {
          browserHistory.push(props.to);
        }
      }
    }
  }
  return (
    <div
      className="selectContainer"
      style={{ marginLeft: 'auto', marginRight: 'auto' }}
    >
      <input
        type="text"
        onChange={props.changeAction}
        maxLength= {props.limit || "500"}
        onKeyDown = {isEnter}
        className="songInput blackText"
        style={style}
        placeholder=""
      />
      <div className="sub">
      {
        props.to ? <Link className="flexable" to={props.to}>
            <button
              className="songSubmit"
              onClick={props.submitAction}
              style={style}
            >
              {
                props.imgIcon
              }
            </button>
          </Link> : <button
            className="songSubmit"
            onClick={props.submitAction}
            style={style}
          >
            {
              props.imgIcon 
            }
          </button>
      }
      </div>
    </div>
  );
};

export default observer(SelectorView);
