window.AudioContext =
  window.AudioContext ||
  window.webkitAudioContext ||
  window.mozAudioContext ||
  window.oAudioContext ||
  window.msAudioContext;
if( !window.AudioContext ) {
  throw new Error( 'Client does not support the Web Audio API' );
}