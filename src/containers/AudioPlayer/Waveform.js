import React, { Component } from 'react';
import WaveSurfer from 'wavesurfer.js';
import css from './AudioPlayer.module.css';
import { Play, Pause } from './audioPlayerIcons';

class Waveform extends Component {
  state = {
    playing: false,
    ready: false,
  };

  componentDidMount() {
    const track = document.querySelector('#track');

    this.waveform = WaveSurfer.create({
      barWidth: 3,
      cursorWidth: 1,
      container: '#waveform',
      backend: 'WebAudio',
      progressColor: 'black',
      responsive: true,
      waveColor: '#EFEFEF',
      cursorColor: 'transparent',
      ...this.props,
    });

    this.waveform
      .load(this.props.url)
      .then(() => {
        setTimeout(this.setState({ ready: true }), 2000);
      })
      .catch(() => {
        setTimeout(this.setState({ ready: true }), 2000);
      });
  }

  handlePlay = () => {
    this.setState({ playing: !this.state.playing });
    this.waveform.playPause();
  };

  render() {
    return (
      <>
        <div className={css.WaveformContainer}>
          {this.state.ready ? (
            <span onClick={this.handlePlay} className={css.PlayButton}>
              {!this.state.playing ? Play : Pause}
            </span>
          ) : (
            <span className={css.loader}></span>
          )}
          <div className={css.Wave} id="waveform">
            <label
              style={{ display: this.state.ready ? 'block' : 'none' }}
              className={css.WaveTitle}
            >
              {this.props.label}
            </label>
          </div>
          <audio id="track" src={this.props.url} />
        </div>
      </>
    );
  }
}

export default Waveform;
