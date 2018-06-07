import React from 'react';
import { observer } from 'mobx-react';
import StripeCheckout from 'react-stripe-checkout';
import icon from '../Assets/otherIcons/Pay-Graphic.jpg';
var PayForSong = props => {
  var handle = token => {
    props.chargeCard(token, props.songId, props.songName);
  };
  return (
    <StripeCheckout
      token={handle}
      amount={100}
      panelLabel="Pay to Play"
      name="Pay to Play"
      image={icon}
      bitcoin
      description="Add song to playlist now!"
      stripeKey="pk_live_EUtQETrTMEVatA6QJfStHrGr"
    >
    <i style={{color:'#7937E4', cursor:'pointer',fontSize:'24px'}} className="icon ion-headphone"></i>
    </StripeCheckout>
  );
};
export default observer(PayForSong);
