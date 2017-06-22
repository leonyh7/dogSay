var React = require('react');
var ReactNative = require('react-native');
var {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} = ReactNative;

var width = Dimensions.get('window').width
var Video = require('react-native-video').default

var Detail = React.createClass({
  getInitialState() {
    return {
      data: this.props.data,
      rate: 1,
      muted: true,
      resizeMode: 'cover',
      repeat: false,
      videoReady: false
    }
  },
  _onLoadStart() { },
  _onLoad() { },
  _onProgress() {
    if (!this.state.videoReady) {
      this.setState({
        videoReady: true
      })
    }
  },
  _onEnd() { },
  _onError() { },
  render() {
    var data = this.props.data
    return (
      <View style={styles.container}>
        <Text>详情页面{this.state.data._id}</Text>
        <View style={styles.videoBox}>
          <Video
            ref='videoPlayer'
            source={{ uri: data.video }}
            style={styles.video}
            volume={5}
            paused={false}
            rate={this.state.rate}
            muted={this.state.muted}
            resizeMode={this.state.resizeMode}
            repeat={this.state.repeat}
            onLoadStart={this._onLoadStart}
            onLoad={this._onLoad}
            onProgress={this._onProgress}
            onEnd={this._onEnd}
            onError={this._onError}
            playInBackground={true}
          />
          {
            !this.state.videoReady && <ActivityIndicator color='#ee735c' style={styles.loading} />
          }
        </View>
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: 65
  },
  videoBox: {
    // width: width,
    // height: 360,
    // backgroundColor: '#000'
  },
  video: {
    width: width,
    height: 360,
    backgroundColor: '#000'
  },
  loading: {
    position: 'absolute',
    left: 0,
    top: 140,
    width: width,
    alignSelf: 'center'
  }
});

module.exports = Detail