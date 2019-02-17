import React, { PureComponent } from 'react';
import { List } from 'immutable';
import { Loader, Header } from 'semantic-ui-react';

const WEBCAM_CONSTRAINTS = { video: true }

export default class StreamOutput extends PureComponent {

  constructor() {
    super()
    this.videoRef = React.createRef();
    this.state = {
      videoOn: false,
      images: List(),
      stream: null,
      noWebcamAccess: false,
    }
    this.track = null;
    this.captureWebcamImage = this.captureWebcamImage.bind(this);
    this.updateVideoStream = this.updateVideoStream.bind(this);
    this.onWebcamAccess = this.onWebcamAccess.bind(this);
    this.onNoWebcamAccess = this.onNoWebcamAccess.bind(this);
  }

  onWebcamAccess(stream) {
    if (stream) {
      this.setState({
        stream: stream
      });
    }
  }

  onNoWebcamAccess() {
    this.setState({
      noWebcamAccess: true,
    })
  }

  componentDidMount() {
    navigator.getUserMedia(WEBCAM_CONSTRAINTS, this.onWebcamAccess, this.onNoWebcamAccess);
  }

  componentDidUpdate() {
    if (this.videoRef && this.videoRef.current) {
      this.updateVideoStream();
    }
  }

  componentWillUnmount() {
    this.track.stop();
  }

  captureWebcamImage(callback) {
    this.imageCapture.takePhoto().then(callback);
  }

  updateVideoStream() {
    if (this.videoRef.current.srcObject !== this.state.stream) {
      this.videoRef.current.srcObject = this.state.stream
      this.track = this.state.stream.getVideoTracks()[0];
      this.imageCapture = new ImageCapture(this.track);
      if (!this.state.videoOn) {
        this.setState({
          videoOn: true,
        })
      }
    }
  }

  renderNoAccess() {
    return <Header as="h3">Could not access webcam</Header>;
  }

  render() {
    if (this.state.noWebcamAccess) {
      return this.renderNoAccess();
    }
    return (
      <video ref={this.videoRef} autoPlay={true} />
    );
  }
}