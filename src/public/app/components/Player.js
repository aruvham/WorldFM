import React from 'react';
import _ from 'underscore';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import {
  setFavorites,
  setSpotifyPlayerVolume,
  setSpotifyPlayerMute,
  setSpotifyPlayerEllapsed,
  setSpotifyPlayerInterval,
  clearSpotifyPlayerInterval,
  setSpotifyPlayerCurrentTrackIdx,
  showLightbox,
  setSpotifyPlayerCurrentTrack,
  removeTrackFromSpotifyQueue } from '../actions';

const millisToMinutesAndSeconds = (millis) => {
  if (millis <= 0) return '0:00';
  const d = new Date(millis);
  const minutes = d.getUTCMinutes();
  const seconds = d.getUTCSeconds();
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const mapStateToProps = state => ({
  auth: state.auth,
  playlist: state.playlist,
  spotifyPlayer: state.spotifyPlayer,
  showVolumeGauge: state.showVolumeGauge,
  showAvailableDevices: state.showAvailableDevices,
  availableDevices: state.availableDevices,
  showQueueMenu: state.showQueueMenu,
  currentCountry: state.currentCountry,
  currentSong: state.currentSong,
  activeDevice: state.activeDevice,
});

const mapDispatchToProps = dispatch => ({
  authUserHandler: () => dispatch({ type: 'AUTHENTICATE_USER' }),
  pauseSpotifyPlayerHandler: isPaused => dispatch({ type: 'PAUSE_SPOTIFY_PLAYER', isPaused }),
  setSpotifyPlayerCurrentTrackHandler: track => dispatch(setSpotifyPlayerCurrentTrack(track)),
  setSpotifyPlayerVolumeHandler: volume => dispatch(setSpotifyPlayerVolume(volume)),
  setSpotifyPlayerMuteHandler: mute => dispatch(setSpotifyPlayerMute(mute)),
  setSpotifyPlayerEllapsedHandler: ellapsed => dispatch(setSpotifyPlayerEllapsed(ellapsed)),
  setSpotifyPlayerIntervalHandler: interval => dispatch(setSpotifyPlayerInterval(interval)),
  clearSpotifyPlayerIntervalHandler: () => dispatch({ type: 'CLEAR_SPOTIFY_PLAYER_INTERVAL' }),
  setSyncStatusHandler: sync => dispatch({ type: 'SET_SPOTIFY_SYNC', sync }),
  setActiveDeviceHandler: device => dispatch({ type: 'SET_ACTIVE_DEVICE', device }),
  setDevicesHandler: devices => dispatch({ type: 'SET_DEVICES', devices }),
  setUserFavoritesHandler: favs => dispatch(setFavorites(favs)),
  showVolumeGaugeEvent: () => dispatch({ type: 'SHOW_VOLUME_GAUGE' }),
  hideVolumeGaugeEvent: () => dispatch({ type: 'HIDE_VOLUME_GAUGE' }),
  showAvailableDevicesEvent: () => dispatch({ type: 'SHOW_AVAILABLE_DEVICES' }),
  hideAvailableDevicesEvent: () => dispatch({ type: 'HIDE_AVAILABLE_DEVICES' }),
  showQueueMenuEvent: () => dispatch({ type: 'SHOW_QUEUE_MENU' }),
  hideQueueMenuEvent: () => dispatch({ type: 'HIDE_QUEUE_MENU' }),
  setSpotifyPlayerCurrentTrackIdx: idx => dispatch(setSpotifyPlayerCurrentTrackIdx(idx)),
  handlePicClick: src => dispatch(showLightbox(src)),

  //queue
  setSpotifyModeHandler: mode => dispatch({ type: 'SET_SPOTIFY_MODE', mode }),
  removeTrackFromSpotifyQueue: idx => dispatch(removeTrackFromSpotifyQueue(idx)),
});

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.pauseTrack = this.pauseTrack.bind(this);
    this.pauseTrack = _.throttle(this.pauseTrack, 750);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.handleVolumeChange = _.throttle(this.handleVolumeChange, 750);
    this.handlePlayClick = this.handlePlayClick.bind(this);
    this.handlePlayClick = _.throttle(this.handlePlayClick, 750);
    this.handleVolumeClick = this.handleVolumeClick.bind(this);
    this.handleVolumeClick = _.throttle(this.handleVolumeClick, 750);
    this.handleSeekerChange = this.handleSeekerChange.bind(this);
    this.handleSeekerChange = _.throttle(this.handleSeekerChange, 750);
    this.refreshDevices = this.refreshDevices.bind(this);
    this.refreshDevices = _.throttle(this.refreshDevices, 750);
    this.handleDeviceClick = this.handleDeviceClick.bind(this);
    this.handleDeviceClick = _.throttle(this.handleDeviceClick, 750);
    this.toggleAvailableDevices = this.toggleAvailableDevices.bind(this);
    this.toggleQueueMenu = this.toggleQueueMenu.bind(this);
    this.handlePreviousClick = this.handlePreviousClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.updateEllapsed = this.updateEllapsed.bind(this);
    this.stopInterval = this.stopInterval.bind(this);
  }

  componentWillMount() {
    this.getUserInfo();
  }

  componentDidUpdate(prev) {
    if (this.$seekerInput && prev.spotifyPlayer.ellapsed !== this.props.spotifyPlayer.ellapsed)  {
      this.$seekerInput.value = this.props.spotifyPlayer.ellapsed;
      if (this.props.spotifyPlayer.ellapsed >= this.props.spotifyPlayer.currentTrack.track_length - 500) {
        this.goToNextTrack();
      }
    }
    ReactTooltip.rebuild();
  }

  goToNextTrack() {
    return new Promise((resolve, reject) => {
      this.props.setSpotifyPlayerEllapsedHandler(-1000);
      this.props.clearSpotifyPlayerIntervalHandler();
      this.pauseTrack()
      .then(() => {
        this.props.pauseSpotifyPlayerHandler(true);
        this.props.setSpotifyPlayerEllapsedHandler(0);
        let nextIdx = this.props.spotifyPlayer.currentTrackIdx;
        let nextTrack;

        if(this.props.spotifyPlayer.mode === 'playlist') {
          // no queue and no change in playlist!
          if (this.props.spotifyPlayer.queue.length === 0) {
            if(this.props.spotifyPlayer.currentTrack === this.props.playlist[this.props.spotifyPlayer.currentTrackIdx]) {
              // playlist is the same
              nextIdx = this.props.spotifyPlayer.currentTrackIdx + 1;
              nextTrack = this.props.playlist[nextIdx] || null;
            } else {
              // playlist changed
              nextIdx = 0;
              nextTrack = this.props.playlist[nextIdx] || null;
            }
          } else {
            // move to queue!
            this.props.setSpotifyModeHandler('queue');
            nextTrack = this.props.spotifyPlayer.queue[0];
          }
        } else {
          // remove from queue!
          this.props.removeTrackFromSpotifyQueue(0);
          if (this.props.spotifyPlayer.queue[0]) {
            // next in queue!
            nextTrack = this.props.spotifyPlayer.queue[0];
          } else {
            // back to playlist!
            this.props.setSpotifyModeHandler('playlist');
            nextIdx = 0;
            nextTrack = null;
          }
        }
        this.props.setSpotifyPlayerCurrentTrackIdx(nextIdx);
        this.props.setSpotifyPlayerCurrentTrackHandler(nextTrack);
        if (nextTrack !== null) {
          this.playTrack(nextTrack)
          .then(() => {
            this.props.pauseSpotifyPlayerHandler(false);
            this.startInterval();
            resolve();
          })
          .catch(err => reject(err));
        } else {
          resolve();
        }
      })
      .catch(err => reject(err));
    });
  }

  stopTrack() {
    return new Promise((resolve, reject) => {
      this.props.setSpotifyPlayerCurrentTrackIdx(null);
      this.props.setSpotifyPlayerCurrentTrackHandler(null);
      this.pauseTrack()
      .then(() => {
        this.props.pauseSpotifyPlayerHandler(false);
        this.props.clearSpotifyPlayerIntervalHandler();
        this.props.setSpotifyPlayerEllapsedHandler(0);
        resolve();
      })
      .catch(err => reject(err));
    })
  }

  getUserInfo() {
    fetch('/user/info', { credentials: 'include' })
      .then((res) => {
        if (res.status === 200) this.props.authUserHandler();
        return res.json();
      })
      .then((res) => {
        console.log(res)
        this.props.setUserFavoritesHandler(res.favs || []);
        this.props.setSyncStatusHandler(res.sync);
        this.updateDeviceInfo(res.devices);
      })
      .catch(err => console.log(err));
  }

  getNewDeviceInfo() {
    fetch('/devices', { credentials: 'include' })
    .then(res => res.json())
    .then(res => this.updateDeviceInfo(res))
    .catch(res => console.log(res));
  }

  setActiveDevice(device) {
    this.props.setActiveDeviceHandler(device);
    this.props.setSpotifyPlayerVolumeHandler(device.volume_percent);
    // this.$volumeInput.value = device.volume_percent;
  }

  handlePlayClick() {
    if (!this.props.spotifyPlayer.currentTrack) {
      this.props.setSpotifyPlayerCurrentTrackHandler(this.props.playlist[0]);
      this.playTrack(this.props.playlist[0])
      .then(() => {
        this.props.pauseSpotifyPlayerHandler(false);
        this.resetInterval();
      })
      .catch(err => console.log(err));
    } else if (this.props.spotifyPlayer.isPaused) {
      this.resumeTrack()
      .then(() => {
        this.props.pauseSpotifyPlayerHandler(false);
        this.startInterval();
      })
      .catch(err => console.log(err));
    } else {
      this.pauseTrack()
      .then(() => {
        this.props.pauseSpotifyPlayerHandler(true);
        this.stopInterval();
      })
      .catch(err => console.log(err));
    }
  }

  stopInterval() { this.props.clearSpotifyPlayerIntervalHandler(); }

  startInterval() {
    this.props.setSpotifyPlayerIntervalHandler(setInterval(this.updateEllapsed, 250));
  }

  updateDeviceInfo(devices) {
    if (devices) {
      let foundActiveDevice = false;
      this.props.setDevicesHandler(devices);
      devices.forEach((device) => {
        if (device.is_active) {
          foundActiveDevice = true;
          this.setActiveDevice(device);
        }
      });
      if (!foundActiveDevice && devices[0] !== undefined) {
        this.setActiveDevice(devices[0]);
      }
    }
  }

  resetInterval() {
    this.props.clearSpotifyPlayerIntervalHandler();
    this.props.setSpotifyPlayerEllapsedHandler(0);
    this.startInterval();
  }

  playTrack(trackToPlay = this.props.spotifyPlayer.currentTrack) {
    return new Promise((resolve, reject) => {
      fetch(`/player/play?device=${this.props.activeDevice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(trackToPlay),
      })
      .then(() => resolve())
      .catch(err => reject(err));
    });
  }

  refreshDevices() {
    fetch('/devices', { credentials: 'include' })
    .then(res => res.json())
    .then(res => this.props.setDevicesHandler(res.devices))
    .catch(res => console.log(res));
  }

  pauseTrack() {
    return new Promise((resolve, reject) => {
      fetch(`/player/pause?device=${this.props.activeDevice.id}`, { credentials: 'include' })
      .then(() => resolve())
      .catch(err => reject(err));
    });
  }

  resumeTrack(ms = this.props.spotifyPlayer.ellapsed) {
    const volume = this.props.spotifyPlayer.volume;
    return new Promise((resolve, reject) => {
      this.changeVolume(0)
      .then(() => {
        this.playTrack()
        .then(() => {
          this.seekTrack(ms)
          .then(() => {
            this.changeVolume(volume)
            .then(() => resolve())
            .catch(err => reject(err));
          })
          .catch(err => reject(err));
        })
        .catch(err => reject(err));
      })
      .catch(err => reject(err));
    });
  }

  seekTrack(ms) {
    return new Promise((resolve, reject) => {
      fetch(`/player/seek?ms=${ms}&device=${this.props.activeDevice.id}`, { credentials: 'include' })
        .then(() => resolve())
        .catch(err => reject(err));
    });
  }

  updateEllapsed() {
    let ellapsed = this.props.spotifyPlayer.ellapsed;
    ellapsed += 250;
    this.props.setSpotifyPlayerEllapsedHandler(ellapsed);
  }

  handleSeekerChange(e) {
    const ms = parseInt(e.target.value, 10);
    this.props.setSpotifyPlayerEllapsedHandler(ms);
    this.resumeTrack(ms)
    .then(() => {
      this.props.pauseSpotifyPlayerHandler(false);
      this.startInterval();
    })
    .catch(err => console.log(err));
  }

  changeVolume(volume) {
    return new Promise((resolve, reject) => {
      fetch(`/player/volume?volume=${volume}&device=${this.props.activeDevice.id}`, { credentials: 'include' })
      .then(() => resolve())
      .catch(err => reject(err));
    });
  }

  handleVolumeChange(e) {
    const volume = parseInt(e.target.value, 10);
    this.changeVolume(volume)
    .then(() => {
      this.props.setSpotifyPlayerVolumeHandler(e.target.value);
    });
  }

  handleVolumeClick() {
    if (parseInt(this.props.spotifyPlayer.volume, 10) > 0) {
      const volume = this.props.spotifyPlayer.volume;
      this.changeVolume(0)
      .then(() => {
        this.$volumeInput.value = '0';
        this.props.setSpotifyPlayerVolumeHandler(0);
        this.props.setSpotifyPlayerMuteHandler(volume);
      })
      .catch(err => console.log(err));
    } else if (this.props.spotifyPlayer.mute) {
      const volume = this.props.spotifyPlayer.mute;
      this.changeVolume(volume)
      .then(() => {
        this.$volumeInput.value = this.props.spotifyPlayer.mute;
        this.props.setSpotifyPlayerVolumeHandler(this.props.spotifyPlayer.mute);
        this.props.setSpotifyPlayerMuteHandler(false);
      })
      .catch(err => console.log(err));
    }
  }

  handlePreviousClick() {
    const prevIdx = this.props.spotifyPlayer.currentTrackIdx - 1;
    const prevTrack = this.props.playlist[prevIdx];
    if (prevTrack) {
      this.pauseTrack()
      .then(() => {
        this.props.pauseSpotifyPlayerHandler(true);
        this.stopInterval();
          this.props.setSpotifyPlayerCurrentTrackHandler(prevTrack);
          this.props.setSpotifyPlayerCurrentTrackIdx(prevIdx);
          this.playTrack()
          .then(() => {
            this.props.pauseSpotifyPlayerHandler(false);
            this.resetInterval();
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
    }
  }

  handleNextClick() {
    this.goToNextTrack();
  }

  toggleVolumeDisplay() {
    if (this.props.showVolumeGauge) this.props.hideVolumeGaugeEvent();
    else this.props.showVolumeGaugeEvent();
  }

  toggleAvailableDevices() {
    if (this.props.showAvailableDevices) this.props.hideAvailableDevicesEvent();
    else this.props.showAvailableDevicesEvent();
  }

  toggleQueueMenu() {
    if (this.props.showQueueMenu) this.props.hideQueueMenuEvent();
    else this.props.showQueueMenuEvent();
  }

  handleDeviceClick(device) {
    if (this.props.spotifyPlayer.isPaused === true ||
        !this.props.spotifyPlayer.currentTrack) {
      this.props.setActiveDeviceHandler(device);
    } else {
      this.pauseTrack()
      .then(() => {
        this.props.pauseSpotifyPlayerHandler(true);
        this.props.setActiveDeviceHandler(device);
        this.stopInterval();
        this.resumeTrack()
        .then(() => {
          this.props.pauseSpotifyPlayerHandler(false);
          this.startInterval();
        })
        .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
    }
  }

  deviceIcon(device) {
    if (device.type === 'Computer') return 'laptop';
    if (device.type === 'Tablet') return 'tablet';
    if (device.type === 'Smartphone') return 'mobile';
    return 'cog';
  }

  savePlaylist() {
    fetch('/playlist/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        country: this.props.currentCountry,
        tracks: this.props.playlist,
      }),
    })
    .then()
    .catch(err => console.log(err));
  }

  render(){
    let playIcon = this.props.spotifyPlayer.isPaused ? 'play' : 'pause';
    if (this.props.spotifyPlayer.isPaused === undefined) playIcon = 'play';
    let volumeIcon = 'up';
    if (this.props.spotifyPlayer.volume < 70) volumeIcon = 'down';
    if (this.props.spotifyPlayer.volume < 20) volumeIcon = 'off';

  return (
      <div className="Player">

        {this.props.auth && this.props.spotifyPlayer.currentTrack &&
        <input
          defaultValue="0"
          className="Player__mobile__seeker__input"
          onMouseDown={this.stopInterval}
          onMouseUp={e => this.handleSeekerChange(e)}
          ref={(el) => { this.$seekerInput = el; }}
          type="range"
          min="0"
          max={this.props.spotifyPlayer.currentTrack.track_length}
          step="250"
        /> }

        <div className="Player__leftPortion">

          <div className="Player__controls">
            <i className="fa fa fa-step-backward fa-lg fa-fw" onClick={this.handlePreviousClick} />
            <i className={`fa fa-${playIcon} fa-2x fa-fw`} onClick={this.handlePlayClick} />
            <i className="fa fa-step-forward fa-lg fa-fw" onClick={this.handleNextClick} />
          </div>

          <div className="Player__extraButtons">

            {this.props.auth && (
                <div
                className="Player__playslistExportToggle"
                display={this.props.auth || 'none'}
                >
                  <i className="fa fa fa-download fa-lg fa-fw"
                  onClick={() => {
                    if(this.props.auth) this.savePlaylist();
                  }}
                  data-tip="Export current playlist to Spotify"
                  />
                  <span>export</span>
                </div>
              )}

                <div className="Player__devicesToggle" display={this.props.auth || 'none'}>
                  <i className="fa fa fa-mobile fa-1x fa-fw"
                  onClick={this.toggleAvailableDevices}
                  data-tip="Listen on another device"
                  />
                  <span>devices</span>
                </div>

                {this.props.showAvailableDevices && (

                  <div className="Device__selector">
                  <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between}' }}
                  >
                    <i className="fa fa-refresh fa-2x fa-fw"
                      onClick={this.refreshDevices}
                    />
                  <div className="Player__devicesTitle">Devices</div>
                    <i className="fa fa fa-times fa-1 fa-fw"
                      onClick={this.toggleAvailableDevices}
                    />
                  </div>
                    {this.props.availableDevices.map((device, idx) => (
                      <div
                        className="Player__devicesDevice"
                        style={{ color: device.id === this.props.activeDevice.id ? 'green' : 'white', cursor: 'pointer' }}
                        key={idx}
                        onClick={() => this.handleDeviceClick(device)}
                      >
                        <i className={`fa fa-${this.deviceIcon(device)} fa-2x fa-fw`} />
                        <span>{device.name}</span>
                    </div>
                  ))}
                  </div>
            )}

            <div className="QueueMenu--toggle">
              <i
                className="fa fa fa-list fa-1x fa-fw"
                onClick={this.toggleQueueMenu}
                data-tip="Show Queue"
              />
              <span>queue</span>
            </div>

          </div>
        </div>

        {this.props.auth && this.props.spotifyPlayer.currentTrack &&
        <div className="Player__seeker">

          {/* <div className="Player__seeker__ellapsed">
            <span>{millisToMinutesAndSeconds(this.props.spotifyPlayer.ellapsed)}</span>
          </div> */}
          {/* Desktop only! */}
          {/* <input

          /> */}
          {/* <div className="Player__seeker__total">
            <span>{millisToMinutesAndSeconds(this.props.spotifyPlayer.currentTrack.track_length)}</span>
          </div> */}

        </div>
        }

        {!this.props.spotifyPlayer.isPaused || this.props.currentSong.isPlaying && <div className="Equalizer">
        <img src="http://rs558.pbsrc.com/albums/ss30/mem72/equalizer.gif~c200" height= {60} />
        </div>}
        {/* current song when authenticated */}
        {this.props.auth && this.props.spotifyPlayer.currentTrack &&
        <div className="CurrentSong">

        <div className="Player__volume">
          <i
            className={`fa fa-volume-${volumeIcon} fa-lg fa-fw`}
            onClick={this.handleVolumeClick}
            onMouseOver={this.props.showVolumeGaugeEvent}
          />

          <div
            className="Player__volumeGauge"
            onMouseOver={this.props.showVolumeGaugeEvent}
            style={{ bottom: this.props.showVolumeGauge ? 94 : -1000 }}
          >
            <input
              ref={(el) => { this.$volumeInput = el; }}
              onMouseOver={this.props.showVolumeGaugeEvent}
              onMouseOut={this.props.hideVolumeGaugeEvent}
              onMouseUp={(e) => {
                e.persist();
                this.handleVolumeChange(e);
              }}
              type="range"
              min="0"
              max="100"
            />
          </div>
        </div>

          <img
            className="CurrentSongPic"
            alt="track_album_image"
            src={this.props.spotifyPlayer.currentTrack.track_album_image}
            width="46"
            height="46"
            onClick={() => {
              this.props.handlePicClick(this.props.spotifyPlayer.currentTrack.track_album_image);
            }}
          />
          <div className="CurrentSongInfo">
            <span>{this.props.spotifyPlayer.currentTrack.track_name}</span>
            <span>{JSON.parse(this.props.spotifyPlayer.currentTrack.track_artist_name).join(', ')}</span>
          </div>

          <div className="Player__CurrentSongTime">
            <span>{millisToMinutesAndSeconds(this.props.spotifyPlayer.ellapsed)} / {millisToMinutesAndSeconds(this.props.spotifyPlayer.currentTrack.track_length)}</span>
          </div>
        </div>
        }

      </div>
    )
  }
}

Player = connect(mapStateToProps, mapDispatchToProps)(Player);
export default Player;
