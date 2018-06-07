import React from 'react';
import img from '../Assets/spin.svg'
import { observer } from 'mobx-react';
var Load = props => {
  var children = props.children;
  return props.loading
    ? <img src={img} alt="" style={{width:'75px',marginTop:props.top||'7%'}} />
    : <div>
      {children}
    </div>;
};
export default observer(Load);
