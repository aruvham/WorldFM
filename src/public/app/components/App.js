import React from 'react';
import ReactTooltip from 'react-tooltip';
import Menu from '../containers/Menu';
import Playlist from '../containers/Playlist';
import HiddenPlayer from '../containers/HiddenPlayer';
import Player from './Player';
import ConnectedGlobe from '../containers/GlobeMenu';
import '../styles/main.scss';
import About from './About';
import Lightbox from './Lightbox';

const showGlobe = true;

const App = () => (
  <div>
    <HiddenPlayer />
    {showGlobe ? <ConnectedGlobe /> : null}
    <Menu />
    <Playlist />
    <Player />
    <About />
    <Lightbox />
    <ReactTooltip />
  </div>
);

export default App;
