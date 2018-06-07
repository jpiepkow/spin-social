import { observable, action } from 'mobx';
var ui = observable({
  showRequestModal: false,
  joinSpinner: false,
  height:1000,
  width:1000,
  songRequestSpinner: false,
  currentPlaylistsSpinner: false,
  setCurrentPlaylistSpinner: action(function(bool) {
    ui.currentPlaylistsSpinner = bool;
  }),
  setRequestSpinner: action(function(bool) {
    ui.songRequestSpinner = bool;
  }),
  setJoinSpinner: action(function(bool) {
    ui.joinSpinner = bool;
  }),
  setScreenSize: action(function(width,height) {
    ui.height = height;
    ui.width = width;
  }),
  toggleRequestModal: action(function(bool) {
    ui.showRequestModal = typeof bool === 'boolean'
      ? bool
      : !this.showRequestModal;
  })
});
export default ui;
