import React from 'react';
import { connect } from 'react-redux';
import { setPlaylist, setCurrentCountry, setCurrentTrend, closeSongMenu } from '../actions';
import availableCountries from '../constance/availableCountries';
import availableTrends from '../constance/availableTrends';
import TopMenu from '../components/TopMenu';
import CountryMenu from '../components/CountryMenu';
import FavoritesMenu from '../components/FavoritesMenu';
import BurgerMenu from '../components/BurgerMenu';
import QueueMenu from '../components/QueueMenu';
import About from '../components/About';


const mapStateToProps = state => ({
  availableCountries,
  availableTrends,
  windowHeight: state.windowHeight,
  windowWidth: state.windowWidth,
  auth: state.auth,
  currentCountry: state.currentCountry,
  currentTrend: state.currentTrend,
  showTrackInfo: state.showTrackInfo,
  showSpotifyPlaylist: state.showSpotifyPlaylist,
  showCountryMenu: state.showCountryMenu,
  showSideMenu: state.showSideMenu,
  showQueueMenu: state.showQueueMenu,

  favorites: state.favorites,
  showAbout: state.showAbout,

  showFavoritesMenu : state.showFavoritesMenu ,

});

const mapDispatchToProps = dispatch => ({
  setCurrentCountry: country => dispatch(setCurrentCountry(country)),
  setCurrentTrend: trend => dispatch(setCurrentTrend(trend)),
  setPlaylist: playlist => dispatch(setPlaylist(playlist)),
  showTrackInfoEvent: () => dispatch({ type: 'SHOW_TRACK_INFO' }),
  hideTrackInfoEvent: () => dispatch({ type: 'HIDE_TRACK_INFO' }),
  showSpotifyPlaylistEvent: () => dispatch({ type: 'SHOW_SPOTIFY_PLAYLIST' }),
  hideSpotifyPlaylistEvent: () => dispatch({ type: 'HIDE_SPOTIFY_PLAYLIST' }),
  showCountryMenuEvent: () => dispatch({ type: 'SHOW_COUNTRY_MENU' }),
  hideCountryMenuEvent: () => dispatch({ type: 'HIDE_COUNTRY_MENU' }),
  showQueueMenuEvent: () => dispatch({ type: 'SHOW_QUEUE_MENU' }),
  hideQueueMenuEvent: () => dispatch({ type: 'HIDE_QUEUE_MENU' }),
  closeSongMenu: () => dispatch(closeSongMenu()),
  showSideMenuEvent: () => dispatch({ type: 'SHOW_SIDE_MENU' }),
  hideSideMenuEvent: () => dispatch({ type: 'HIDE_SIDE_MENU' }),

  showAboutEvent: () => dispatch({ type: 'SHOW_ABOUT' }),
  hideAboutEvent: () => dispatch({ type: 'HIDE_ABOUT' }),

  showFavoritesMenuEvent: () => dispatch( {type: 'SHOW_FAVORITES_MENU' }),
  hideFavoritesMenuEvent: () => dispatch( {type: 'HIDE_FAVORITES_MENU' }),

});

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleTrendChange = this.handleTrendChange.bind(this);
    this.toggleTrackInfo = this.toggleTrackInfo.bind(this);
    this.toggleSpotifyPlaylist = this.toggleSpotifyPlaylist.bind(this);
    this.toggleCountryMenu = this.toggleCountryMenu.bind(this);
    this.toggleSideMenu = this.toggleSideMenu.bind(this);
    this.toggleQueueMenu = this.toggleQueueMenu.bind(this);

    this.toggleAbout = this.toggleAbout.bind(this);

    this.toggleFavoritesMenu = this.toggleFavoritesMenu.bind(this);

    // console.log(props.auth);
  }

  componentDidMount() {
    this.getPlaylist();
  }

  componentDidUpdate(prev) {
    // only getPlaylist if necessary
    if (prev.currentCountry !== this.props.currentCountry) {
      this.getPlaylist();
      this.props.closeSongMenu();
    } else if (prev.currentTrend !== this.props.currentTrend) {
      this.getPlaylist();
      this.props.closeSongMenu();
    }
  }

  handleCountryChange(e) {
    this.props.setCurrentCountry(e.value);
  }

  handleTrendChange(e) {
    this.props.setCurrentTrend(e.target.value);
    // console.log(e)
  }

  getPlaylist(e) {
    fetch(`playlist?country=${this.props.currentCountry}&trend=${this.props.currentTrend}`)
      .then(res => res.json())
      .then(res => this.props.setPlaylist(res))
      .catch(err => console.log(err));
  }

  toggleTrackInfo() {
    if (this.props.showTrackInfo) this.props.hideTrackInfoEvent();
    if (!this.props.showTrackInfo) this.props.showTrackInfoEvent();
  }

  toggleSpotifyPlaylist() {
    if (this.props.showSpotifyPlaylist) this.props.hideSpotifyPlaylistEvent();
    if (!this.props.showSpotifyPlaylist) this.props.showSpotifyPlaylistEvent();
  }

  toggleCountryMenu() {
    if (this.props.showCountryMenu) this.props.hideCountryMenuEvent();
    if (!this.props.showCountryMenu) this.props.showCountryMenuEvent();
  }

  toggleSideMenu() {
    console.log(this.props.showSideMenu);
    if (this.props.showSideMenu) this.props.hideSideMenuEvent();
    if (!this.props.showSideMenu) this.props.showSideMenuEvent();
  }

  toggleQueueMenu() {

    if (this.props.showQueueMenu) this.props.hideQueueMenuEvent();
    if (!this.props.showQueueMenu) this.props.showQueueMenuEvent();
  }

  toggleAbout() {
    console.warn('YOOOO');
    if (this.props.showAbout) this.props.hideAboutEvent();
    if (!this.props.showAbout) this.props.showAboutEvent();

    if(this.props.showQueueMenu) this.props.hideQueueMenuEvent();
    if(!this.props.showQueueMenu) this.props.showQueueMenuEvent();
  }

  toggleFavoritesMenu() {
    if(this.props.showFavoritesMenu) this.props.hideFavoritesMenuEvent();
    if(!this.props.showFavoritesMenu) this.props.showFavoritesMenuEvent();

  }



  render() {
    return (
      <div>
        <TopMenu
          auth={this.props.auth}
          toggleCountryMenu={this.toggleCountryMenu}
          toggleQueueMenu={this.toggleQueueMenu}
          toggleSpotifyPlaylist={this.toggleSpotifyPlaylist}
          toggleTrackInfo={this.toggleTrackInfo}
          toggleSideMenu={this.toggleSideMenu}
          toggleFavoritesMenu={this.toggleFavoritesMenu}
          availableCountries={this.props.availableCountries}
          handleCountryChange={this.handleCountryChange}
          currentCountry={this.props.currentCountry}
          windowHeight={this.props.windowHeight}
          windowWidth={this.props.windowWidth}
        />
        {/* <CountryMenu
          availableCountries={this.props.availableCountries}
          availableTrends={this.props.availableTrends}
          currentCountry={this.props.currentCountry}
          currentTrend={this.props.currentTrend}
          handleCountryChange={this.handleCountryChange}
          handleTrendChange={this.handleTrendChange}
          showCountryMenu={this.props.showCountryMenu}
          toggleTrackInfo={this.toggleTrackInfo}
          toggleCountryMenu={this.toggleCountryMenu}
        /> */}
        <FavoritesMenu
          showFavoritesMenu={this.props.showFavoritesMenu}
        />
        <QueueMenu
          toggleQueueMenu={this.toggleQueueMenu}
        />
        {this.props.showSideMenu ? <BurgerMenu
          toggleAbout={this.toggleAbout}
          toggleCountryMenu={this.toggleCountryMenu}
          toggleSpotifyPlaylist={this.toggleSpotifyPlaylist}
          toggleQueueMenu={this.toggleQueueMenu}
        /> : null}
      </div>
    );
  }
}

Menu = connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);
export default Menu;
