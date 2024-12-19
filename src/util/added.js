const getParameterByName = (name, url = window.location.href) => {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const getUrl = (window = window) => {
  return `${window.location.origin}${window.location.pathname}`;
};

const clearQueryParams = (window = window) => {
  return window.location.replace(getUrl(window));
};

const create_UUID = () => {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}

const baseUrlSocial = {
  instagram: 'https://www.instagram.com/',
  appleMusic: 'https://music.apple.com/us/artist/',
  spotify: 'https://open.spotify.com/artist/',
  soundcloud: 'https://soundcloud.com/',
  tidal: 'https://tidal.com/browse/artist/',
};

module.exports = {baseUrlSocial, create_UUID, clearQueryParams, getUrl, getParameterByName}