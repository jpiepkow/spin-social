import UserStore from './Stores/UserStore';
import uiStore from './Stores/UIStore';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App';
import Home from './Home/Home';
import Login from './Login/Login';
import StartLogin from './Login/StartLogin';
import StartPlaylist from './StartParty/StartPartyParent';
import DistanceAndTime from './StartParty/DistanceAndTime';
import PartyCreated from './StartParty/PartyCreated';
import PickSongs from './StartParty/PickSongs';
import JoinPlaylist from './JoinParty/JoinPartyParent';
import Faq from './FAQ/Faq';
import PartyJoined from './JoinParty/PartyJoined';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import './index.css';
import './bootstrap3.css';
import './buttons.css';
var ReactGA = require('react-ga');
ReactGA.initialize(process.GA_KEY);

function logPageView() {
  ReactGA.set({ page: window.location.pathname + window.location.search });
  ReactGA.pageview(window.location.pathname + window.location.search);
}
var storeObj = { uiStore: uiStore, user: UserStore };
ReactDOM.render(
  <Router history={browserHistory} onUpdate={logPageView}>
    <Route path="/" stores={storeObj} component={App}>
      <IndexRoute component={Home} stores={storeObj} />
      <Route
        path="/startplaylist"
        component={StartPlaylist}
        stores={storeObj}
        onEnter={UserStore.requireAuth}
      />
      <Route
        path="/faq"
        component={Faq}
        stores={storeObj}
      />
      <Route
        path="/startplaylist/nameparty"
        component={StartPlaylist}
        stores={storeObj}
        onEnter={UserStore.requireAuth}
      />
      <Route
        path="/startplaylist/distanceandtime"
        component={DistanceAndTime}
        stores={storeObj}
        onEnter={UserStore.requireAuth}
      />
      <Route
        path="/startplaylist/picksongs"
        component={PickSongs}
        stores={storeObj}
        onEnter={UserStore.requireAuth}
      />
      <Route
        path="/startplaylist/:partyId"
        component={PartyCreated}
        stores={storeObj}
        onEnter={UserStore.requireAuth}
      />
      <Route path="/login" component={Login} stores={storeObj} />
      <Route path="/startlogin" component={StartLogin} stores={storeObj} />
      <Route
        path="/joinplaylist"
        component={JoinPlaylist}
        stores={storeObj}
        onEnter={UserStore.requireAuth}
      />
      <Route
        path="/joinplaylist/:partyId"
        component={PartyJoined}
        stores={storeObj}
        onEnter={UserStore.requireAuth}
      />
    </Route>
  </Router>,
  document.getElementById('root')
);
