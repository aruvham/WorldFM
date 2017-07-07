# WorldFM

**A World of Sweet Tunes**

**WorldFM** is a React/Redux Web Application for discovering new music, powered by Spotify’s API

It features a fully functional audio player, that allows the user to control Spotify's playback from any device. You can even switch playback between devices on the go!

Discover trending music from over 90 countries and 1500 musical genres, from Math Rock to Classic Chinese Pop

Love the music? Save your favorites and sync them with your Spotify account to listen at any time

Easily navigate the website using our responsive, mobile-friendly user interface. Including a fully interactive 3D visualization of the earth

Thanks to our web worker, new music is being added each week to our ever-growing library

* [Check it out!]

![Gif of application](src/public/assets/WorldFM.gif)

Key Features
------

* 30 second song previews without logging in
* Enjoy your favorite album art in our full-screen presentation mode
* Interactive 3D visualization of the world
* Search music by country or genre
* Fully fledged audio player
* Export current search as a Spotify playlist
* Queue functionality
* Transfer playback between any device with access to Spotify
* Persistent favorites list
* Sync your favorites to your Spotify account

How to Use
------

WorldFM uses OAuth authentication to connect to your Spotify account and unlock access to the full set of features. If you are not logged in, you can still use the app to search for music, but you are limited to 30-second previews for each song.

To sign in, click on the Spotify icon located on the top-right corner of the screen. Upon success, this icon will be colored in bright green.

<h3 align="center">
  <img src="https://dl.dropboxusercontent.com/s/3udrf0udeok8euw/worldfm_05.png?dl=0" />
</h3>

**Please note that currently, only Spotify Premium accounts are supported. You will also need to have Spotify open in at least one device in order to listen to music**

**Full Version Features**

<h3 align="center">
  <img src="https://dl.dropboxusercontent.com/s/o0g2xksmoqw73vg/worldfm_06.png?dl=0" />
</h3>

* **Seeker Bar:** Allows you to visualize the elapsed time for the current song. Clicking on any part of the seeker bar will skip the playback to that specific position.

<h3 align="center">
  <img src="https://dl.dropboxusercontent.com/s/j1vwsq2lrbwoqbl/worldfm_08.png?dl=0" />
</h3>

* **Current Song Preview:** In this component, you can see information about the current song being played. Clicking on the album art will take you to presentation mode for that song.

<h3 align="center">
  <img src="https://dl.dropboxusercontent.com/s/7u0mu49age180bl/worldfm_09.png?dl=0" />
</h3>

* **Shuffle**

* **Previous Track**

* **Play / Pause**

* **Next Track**

* **Repeat**

<h3 align="center">
  <img src="https://dl.dropboxusercontent.com/s/jt4yhok1hkd2zvl/worldfm_10.png?dl=0" />
</h3>

* **Volume**

* **Export:**  Clicking this button will create a new playlist in your Spotify account, that playlist will be pre-populated with all the songs currently being displayed in the app.

<h3 align="center">
  <img src="https://dl.dropboxusercontent.com/s/k41a8d50ocq7jhx/worldfm_02.png?dl=0" />
</h3>

* **Devices:** This window allows you to see the list of available devices and switch between them. To refresh the list click on the icon on the top left corner of this window. Clicking on any inactive devices (even if a song is currently playing) will transfer playback to that particular device.

The current active device is shown here in bright green, inactive devices are shown in white.

<h3 align="center">
  <img src="https://dl.dropboxusercontent.com/s/047ioyfcmj2uyjh/worldfm_07.png?dl=0" />
</h3>

* **Queue:** This window allows the user to visualize the list of songs that are set to be played next. This list doest not persist and will be lost if the user refreshes the window.

You can remove all songs from favorites by clicking the icon on the top left corner of the window.

To add a song to the queue press the plus icon corresponding to that song.

<h3 align="center">
  <img src="https://dl.dropboxusercontent.com/s/v2vgqsn1dvewd45/worldfm_03.png?dl=0" />
</h3>

* **Favorites:** In this window you can keep track of your favorite songs. This list is persisted in our database and will be there even if close that app and come back later.

Your favorites list is linked to a unique playlist in Spotify that will be created the first time you sync.

You can remove all songs from the queue by clicking the icon on the top left corner of the window.

To add a song to favorites press the heart icon corresponding to that song.

If the sync toggle is active (green), all changes made to your WorldFM favorites will be reflected immediately in your Spotify playlist. Otherwise, the changes will be saved, but they won't have any effect on your Spotify playlist until you decide to sync.

Tech Stack
------

**Frontend**

* HTML
* CSS / SCSS
* React / Redux
* D3
* ParticlesJS

**Backend**

* Node / Express
* Passport
* MySQL / Knex
* Spotify API

### The WorldFM Team

* [Anthony Greenheck] - Fullstack Developer & Product Owner
* [Arturo Ruvalcaba] - Fullstack Developer & Scrum Master
* [David Hamberlin] - Fullstack Developer
* [Pierry Etienne] - Fullstack Developer

<!-- Links -->

[Check it out!]:https://worldfm.herokuapp.com/
[Anthony Greenheck]:https://github.com/anthonyemg
[Arturo Ruvalcaba]:https://github.com/aruvham
[David Hamberlin]:https://github.com/dhamberlin
[Pierry Etienne]:https://github.com/petienne1
