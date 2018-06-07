import React, { Component } from 'react';
import './Faq.css';
import { observer } from 'mobx-react';

class Fqa extends Component {
  render() {
    return (
      <div className="fqa-wrapper">
			<div className="fqa-block">
          <p className="fontRegularFqa">Why do I need a spotify account?</p>
          <p className="fontPara">
          	We use spotify for all your music playing needs(because spotify is awesome). Spotify has a massive library of music to chose from and 
          	we believe it offeres the best experience to our users.
          	Currently you do not need a spotify premium account but that may change as we add new features down the road.
          </p>
	    </div>
      <div className="fqa-block">
          <p className="fontRegularFqa">What are the requirements to host or join a spin playlist?</p>
          <p className="fontPara">
          Current requirements to host a spin playlist:<br/>
          Use either the Android or Iphone application to play your spin playlist(this will change in the future but right now is a limitation of spotify api).<br/><br/>
          Current requirements to join a spin playlist: <br/>
          As long as you are on a device that can get its location(any device now a day) you can connect to a spin playlist.

          </p>
	    </div>
      <div className="fqa-block">
          <p className="fontRegularFqa">What does it mean that Spin is in beta?</p>
          <p className="fontPara">Because spin.social integrates closly with spotify to get you all of your music
           being in beta means things might not always work the way you expect. Because their are many different ways
           to listen to your spotify playlist currently we can not guarantee that it will work correctly on each system(Android,Iphone,Desktop)
           A lot of the parts of spotify we are using are brand new and also in beta so we will remain in beta until spotify
           ends their beta period.
           </p>
	    </div>	
      <div className="fqa-block">
          <p className="fontRegularFqa">No songs are being added to my playlist. Whats going on?</p>
          <p className="fontPara">There are a couple reasons why songs may not be added to your playlist. The first and 
          and most likely is that you have not started playing your playlist in your spotify application. The second reason this may
          be the case is you are using a spotify application that does not currently support the things we need. To ensure everything works correctly
          for the time being we suggest you use either the Android or Iphone application to run you spotify playlist.


          </p>
	    </div>	
      <div className="fqa-block">
          <p className="fontRegularFqa">How can I get in touch if I am having an issue?</p>
          <p className="fontPara">The fastest way to get a response is by clicking on the twitter icon below. For all bug related things please email spin.social.help@gmail.com</p>
	    </div>	
	    <div className="fqa-block">
          <p className="fontRegularFqa">What features can I look forward to down the road?</p>
          <a href="https://trello.com/b/eAioZTJ2/spin-feature-tracker"><p className="fontPara">Feature tracker</p></a> 
	    </div>	
      </div>
    );
  }
}

export default observer(Fqa);