var React = require('react');
var ReactNative = require('react-native');
var {
  ActivityIndicator,
  Dimensions,
  ListView,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} = ReactNative;
import Icon from 'react-native-vector-icons/Ionicons';

var request = require('../common/request')
var config = require('../common/config')

var width = Dimensions.get('window').width
var Video = require('react-native-video').default

var cachedResults = {
  nextPage: 1,
  items: [],
  total: 0
}

var Detail = React.createClass({
  getInitialState() {
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    })
    return {
      data: this.props.data,
      // 评论
      dataSource: ds.cloneWithRows([]),
      isLoadingTail: false,
      page: 1,
      init: false,
      // video loads
      rate: 1,
      muted: true,
      resizeMode: 'contain',
      repeat: false,
      videoLoaded: false,
      videoProgress: 0.01,
      currentTime: 0,
      paused: false,
      videoOk: true,
    }
  },
  _onLoadStart() { },
  _onLoad() {
    this.setState({
      videoLoaded: true,
      playing: true
    })
  },
  _onProgress(data) {
    // console.log(data)
    if (!this.state.videoLoaded || !this.state.playing) return

    var duration = data.playableDuration
    var currentTime = data.currentTime

    var percent = Number((currentTime / duration).toFixed(2))
    var newState = {
      videoTotal: duration,
      currentTime: Number(data.currentTime.toFixed(2)),
      videoProgress: percent
    }
    this.setState(newState)
  },
  _onEnd() {
    this.setState({
      videoProgress: 1,
      playing: false
    })
  },
  _onError() {
    this.setState({
      videoOk: false
    })
  },
  _replay() {
    this.refs.videoPlayer.seek(0)
    this.setState({
      playing: true
    })
  },
  _pause() {
    var paused = !this.state.paused;
    this.setState({
      paused: paused
    })
  },
  // _resume() {
  //   this.setState({
  //     paused: false
  //   })
  // },
  componentDidMount() {
    this._fetchData()
  },
  _fetchData(page) {
    if (page !== 0) {// 上拉加载
      this.setState({
        isLoadingTail: true
      })
    }
    request.get(config.host + config.api.comment, {
      accessToken: 'aa',
      page: page
    }).then((data) => {
      if (data.success) {
        var items = cachedResults.items.slice()
        items = items.concat(data.data)
        cachedResults.nextPage += 1
        cachedResults.items = items
        cachedResults.total = data.total
        setTimeout(() => {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(cachedResults.items),
            isLoadingTail: false
          })
        }, 500)
      }
    }).catch(error => {
      if (page !== 0) {
        this.setState({
          isLoadingTail: false,
          init: true
        })
      } else {
        this.setState({
          isRefreshing: false,
          init: true
        })
      }
      console.error(error)
    })
  },
  _renderRow(row) {
    return (
      <View key={row._id} style={styles.replyBox}>
        <Image style={styles.replyAvatar} source={{ uri: row.replyBy.avatar }} />
        <View style={styles.reply}>
          <Text style={styles.replyNickname}>
            {row.replyBy.nickname}
          </Text>
          <Text style={styles.relyContent}>
            {row.content}
          </Text>
        </View>
      </View>
    )
  },
  _fetchMoreData() {
    if (!this.state.init || !this._hasMore() || this.state.isLoadingTail) {
      this.state.init = true
      return
    }

    var page = cachedResults.nextPage
    this._fetchData(page)
  },
  _hasMore() {
    return cachedResults.items.length !== cachedResults.total
  },
  _renderHeader() {
    var data = this.state.data
    return (
      <View style={styles.infoBox}>
        <Image style={styles.avatar} source={{ uri: data.author.avatar }} />
        <View style={styles.descBox}>
          <Text style={styles.nickname}>
            {data.author.nickname}
          </Text>
          <Text style={styles.title}>
            {data.author.description}
          </Text>
        </View>
      </View>
    )
  },
  _renderFooter() {
    if (!this._hasMore() && cachedResults.total != 0) {
      return (
        <View style={styles.loadingMore}>
          <Text style={styles.loadingText}>没有更多了</Text>
        </View>
      )
    }
    if (!this.state.isLoadingTail) {
      return (
        <View />
      )
    }
    return (
      <ActivityIndicator style={styles.loadingMore}></ActivityIndicator>
    )

  },
  render() {
    var data = this.props.data
    return (
      <View style={styles.container}>
        <View style={styles.videoBox}>
          <Video
            ref='videoPlayer'
            source={{ uri: data.video }}
            style={styles.video}
            volume={5}
            paused={this.state.paused}
            rate={this.state.rate}
            muted={this.state.muted}
            resizeMode={this.state.resizeMode}
            repeat={this.state.repeat}
            onLoadStart={this._onLoadStart}
            onLoad={this._onLoad}
            onProgress={this._onProgress}
            onEnd={this._onEnd}
            onError={this._onError}
          />
          {
            !this.state.videoOk && <Text style={styles.failText}>视频出错了</Text>
          }
          {
            !this.state.videoLoaded && <ActivityIndicator color='#ee735c' style={styles.loading} />
          }
          {
            this.state.videoLoaded && !this.state.playing
              ? <Icon
                onPress={this._replay}
                name='ios-play'
                size={48}
                style={styles.playIcon}
              /> : null
          }
          {
            this.state.videoLoaded && this.state.playing
              ? <TouchableOpacity
                onPress={this._pause} style={styles.pauseBtn}>
                {
                  this.state.paused
                    ? <Icon
                      // onPress={this._resume}
                      name='ios-play'
                      size={48}
                      style={styles.resumeIcon} />
                    : null
                }
              </TouchableOpacity> : null
          }
          <View style={styles.progressBox}>
            <View style={[styles.progressBar, { width: width * this.state.videoProgress }]}></View>
          </View>
        </View>
        <ListView
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          onEndReached={this._fetchMoreData}
          onEndReachedThreshold={20}
          renderHeader={this._renderHeader}
          renderFooter={this._renderFooter}
          renderRow={this._renderRow}
          showsVerticalScrollIndicator={false}>>
          </ListView>
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
    paddingTop: 64,
    paddingBottom: 48
  },
  // 视频
  videoBox: {
    width: width,
    height: width * 0.56,
    backgroundColor: '#000'
  },
  video: {
    width: width,
    height: width * 0.56,
    backgroundColor: '#000'
  },
  loading: {
    position: 'absolute',
    left: 0,
    top: width * 0.28 - 30,
    width: width,
    alignSelf: 'center'
  },
  progressBox: {
    width: width,
    height: 2,
    backgroundColor: '#ccc'
  },
  progressBar: {
    width: 1,
    height: 2,
    backgroundColor: '#f60'
  },
  playIcon: {
    position: 'absolute',
    top: width * 0.28 - 30,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    paddingTop: 8,
    paddingLeft: 22,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    color: '#ed7b66'
  },
  pauseBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: width,
    height: width * 0.56,
  },
  resumeIcon: {
    position: 'absolute',
    top: width * 0.28 - 30,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    paddingTop: 8,
    paddingLeft: 22,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    alignSelf: 'center',
    color: '#ed7b66'
  },
  failText: {
    position: 'absolute',
    left: 0,
    top: 170,
    width: width,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'transparent'
  },
  // 作者
  infoBox: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 30
  },
  descBox: {
    flex: 1
  },
  nickname: {
    fontSize: 18
  },
  title: {
    marginTop: 8,
    fontSize: 16,
    color: '#666'
  },
  // 回复列表
  replyBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10
  },
  replyAvatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 20
  },
  replyNickname: {
    color: '#666'
  },
  relyContent: {
    marginTop: 4,
    color: '#666'
  },
  reply: {
    flex: 1
  },
  loadingMore: {
    marginVertical: 20
  },
  loadingText: {
    color: '#777',
    textAlign: 'center'
  }
});

module.exports = Detail