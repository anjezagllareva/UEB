// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./styles/style.scss";
import Overlay from "./components/side-components/overlay";
import Music from "./components/music/music";
import songs from "./songs.utlil";
import SongsList from "./components/songs-list/SongsList";
import Sidebar from "./components/side-bar/SideBar";
import TrendingSlider from "./components/trending-slider/TrendingSlider";
import Preloader from "./components/preloader/Preloader";
import VideoPage from "./components/video-page/VideoPage";

class App extends React.Component {
  state = { songs, currentSongIndex: 0, isSideBarShown: false, isLoading: true };

  componentDidMount() {
    // Simulate a loading process (e.g., fetching data, initializing player)
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 3000); // Adjust the timeout as necessary
  }

  togglePlay = (audioRef) => {
    const songs = this.state.songs;
    if (songs[this.state.currentSongIndex].isPlaying) {
      audioRef.current.pause();
      this.handleTogglePlay();
    } else {
      var playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then((_) => {
            this.handleTogglePlay();
          })
          .catch((error) => {
            console.log("autoplay prevented");
          });
      }
    }
  };

  handleTogglePlay = () => {
    const songs = this.state.songs;
    songs[this.state.currentSongIndex].isPlaying =
      !songs[this.state.currentSongIndex].isPlaying;

    this.setState({ songs });
  };

  skipForward = () => {
    try {
      const numberOfSongs = this.state.songs.length;
      let currentSongIndex = this.state.currentSongIndex + 1;
      if (currentSongIndex === numberOfSongs) {
        currentSongIndex = 0;
      }
      const songs = this.state.songs;
      songs[currentSongIndex].isPlaying = true;

      this.setState({ songs, currentSongIndex });
    } catch (err) {
      setTimeout(() => {
        this.skipForward();
      }, 300);
    }
  };

  skipBackward = () => {
    try {
      const numberOfSongs = this.state.songs.length;
      let currentSongIndex = this.state.currentSongIndex - 1;
      if (currentSongIndex === -1) {
        currentSongIndex = numberOfSongs - 1;
      }
      const songs = this.state.songs;
      songs[currentSongIndex].isPlaying = true;

      this.setState({ songs });

      this.setState({ currentSongIndex });
    } catch (err) {
      setTimeout(() => {
        this.skipBackward();
      }, 300);
    }
  };

  onClickCard = (song) => {
    try {
      let songs = this.state.songs;
      let currentSongIndex = this.state.currentSongIndex;
      currentSongIndex = songs.indexOf(song);
      songs[currentSongIndex].isPlaying = true;
      this.setState({ currentSongIndex, songs });
    } catch (err) {
      setTimeout(() => {
        this.onClickCard(song);
      }, 200);
    }
  };

  toggleSideBar = () => {
    this.setState({ isSideBarShown: !this.state.isSideBarShown });
  };

  render() {
    if (this.state.isLoading) {
      return <Preloader />; // Render the preloader while loading
    }
    return (
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <div className="App">
                <Music
                  handleSkipForward={this.skipForward}
                  handleSkipBackward={this.skipBackward}
                  handleTooglePlay={this.togglePlay}
                  song={this.state.songs[this.state.currentSongIndex]}
                  stopLoadingHandler={this.stopLoading}
                  hideSidebar={() => {
                    this.setState({ isSideBarShown: false });
                  }}
                />
                <TrendingSlider songs={this.state.songs} />
                <SongsList
                  songs={this.state.songs}
                  displayedSong={this.state.songs[this.state.currentSongIndex].name}
                  handleClickCard={this.onClickCard}
                  Sidebar={Sidebar}
                  toggleSideBar={this.toggleSideBar}
                  isSideBarShown={this.state.isSideBarShown}
                  hideSidebar={() => {
                    this.setState({ isSideBarShown: false });
                  }}
                />
                <Overlay
                  color={this.state.songs[this.state.currentSongIndex].color}
                  bg={this.state.songs[this.state.currentSongIndex].image}
                />
                <MusicButton />
                <audio ref={(ref) => (this.audioRef = ref)} src={this.state.songs[this.state.currentSongIndex].url}></audio>
              </div>
            }
          />
          <Route path="/video" element={<VideoPage />} />
        </Routes>
      </Router>
    );
  }
}

const MusicButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/video")}
      className="music-button"
    >
      Play Video
    </button>
  );
};

export default App;
