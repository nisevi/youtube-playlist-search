[![npm version](https://badge.fury.io/js/youtube-playlist-search.svg)](https://badge.fury.io/js/youtube-playlist-search)

# youtube-playlist-search

Searches over title and description of videos in an specific playlist.

This library was born as a need for retrieving info from a specific YouTuBe playlist and search over their results. At this point, as I'm learning React it was easier for me to code this library and use it, than to code this functionality inside the [React APP](https://github.com/nisevi/scrums).

# Installation

`yarn add youtube-playlist-search`

# Supported parameters

  - key
    - Your API key from [Google developer console](https://console.developers.google.com/apis/credentials).
      
      This parameter is required.

  - maxResults
    - unsigned integer
    
      The **maxResults** parameter specifies the maximum number of items that should be returned in the result set. Acceptable values are 0 to 50, inclusive. The default value is 5.

      Default value **30**.

  - part
    - string
    
      The **part** parameter specifies a comma-separated list of one or more **playlistItem** resource properties that the API response will include.
      
      If the parameter identifies a property that contains child properties, the child properties will be included in the response. For example, in a **playlistItem** resource, the **snippet** property contains numerous fields, including the **title**, **description**, **position**, and **resourceId** properties. As such, if you set **part=snippet**, the API response will contain all of those properties.
      
      The following list contains the part names that you can include in the parameter value and the [quota](https://developers.google.com/youtube/v3/getting-started#quota) cost for each part:
      - **contentDetails**: 2
      - **id**: 0
      - **snippet**: 2
      - **status**: 2

      Default value **'snippet,contentDetails'**

  - playlistId
    - string
    
      The **playlistId** parameter specifies the unique ID of the playlist for which you want to retrieve playlist items. Note that even though this is an optional parameter, every request to retrieve playlist items must specify a value for either the id parameter or the playlistId parameter.

      This parameter is required.

These parameters are based on the ones specified for the [playlistItem YouTuBe API](https://developers.google.com/youtube/v3/docs/playlistItems), except from **key** (the API key that I'm using for making the request) and from **term** which I'm using for filtering the results that come in the response.

# How to use it

[Here](https://github.com/nisevi/scrums/blob/master/src/App.js) is an example of how I'm using it:

```javascript
import _ from 'lodash';
import YTSearch from 'youtube-playlist-search';
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SearchBar from './components/search_bar';
import VideoList from './components/video_list';
import VideoDetail from './components/video_detail';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videos: [],
      selectedVideo: null
    };

    this.key = process.env.REACT_APP_YTB_API_KEY_DEV
    if (process.env.NODE_ENV === 'production') {
      this.key = process.env.REACT_APP_YTB_API_KEY_PROD
    }

    this.params = {
      part: 'snippet,contentDetails',
      playlistId: 'PLH99prTh-VPqO7ld0o2Sny6bLxpf80Js0',
      key: this.key
    };

    this.videoSearch('')
  }

  videoSearch(term) {
    YTSearch(term, this.params, (err, videos) => {
      this.setState({
        videos: videos,
        selectedVideo: videos[0]
      });
    });
  }

  render() {
    const videoSearch = _.debounce((term) => {this.videoSearch(term)}, 300);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <SearchBar onSearchTermChange={videoSearch}/>
        <VideoDetail video={this.state.selectedVideo}/>
        <VideoList
          onVideoSelect={selectedVideo => this.setState({selectedVideo})}
          videos={this.state.videos}/>
      </div>
    );
  }
}

export default App;
``` 