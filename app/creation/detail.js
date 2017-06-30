var React = require('react');
var ReactNative = require('react-native');
var {
  ActivityIndicator,
  AlertIOS,
  Dimensions,
  ListView,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} = ReactNative;
var Icon = require('react-native-vector-icons/Ionicons').default
var Video = require('react-native-video').default
var Button = require('react-native-button').default

var request = require('../common/request')
var config = require('../common/config')

var width = Dimensions.get('window').width


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

      content: '',
      // modal
      animationType: 'none',
      modalVisible: false,
      isSending: false
    }
  },
  // 视频播放
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
  // 评论列表
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
      creation: '11',
      page: page
    }).then((data) => {
      if (data.success) {
        var items = cachedResults.items.slice()
        items = items.concat(data.data)
        cachedResults.nextPage += 1
        cachedResults.items = items
        cachedResults.total = data.total
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(cachedResults.items),
          isLoadingTail: false
        })
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
    return cachedResults.items.length < cachedResults.total
  },
  // 评论
  _closeModal() {
    this._setModalVisible(false)
  },
  _focus() {
    this._setModalVisible(true)
  },
  _setModalVisible(isVisible) {
    this.setState({
      modalVisible: isVisible
    })
  },
  _renderHeader() {
    var data = this.state.data
    return (
      <View style={styles.listHeader}>
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
        <View style={styles.commentBox}>
          <View style={styles.comment}>
            <TextInput
              placeholder='评论一下...'
              style={styles.content}
              multiline={true}
              onFocus={this._focus} />
          </View>
        </View>
        <View style={styles.commentArea}>
          <Text style={styles.commentTitle}>精彩评论</Text>
        </View>
      </View>
    )
  },
  _submit() {
    if (!this.state.content) {
      return AlertIOS.alert('留言不能为空')
    }
    if (this.state.isSending) {
      return AlertIOS.alert('正在评论中')
    }
    this.setState({
      isSending: true
    }, () => {
      var body = {
        accessToken: 'aa',
        creation: '111',
        content: this.state.content
      }
      var url = config.host + config.api.comment
      request.post(url, body)
        .then((data) => {
          if (data && data.success) {
            var items = cachedResults.items.slice()
            items = [{
              content: this.state.content,
              replyBy: {
                nickname: 'aaaa',
                avatar: 'http://dummyimage.com/640x640/7ec994'
              }
            }].concat(items)
            cachedResults.items = items
            cachedResults.total = cachedResults.total + 1
            this.setState({
              isSending: false,
              dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)
            })
            this._setModalVisible(false)
          }
        })
        .catch((error) => {
          console.log(error)
          this._setModalVisible(false)
          AlertIOS.alert('留言失败，请稍后重试')
        })
    })
  },
  _input(text) {
    this.setState({
      content: text
    })
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
          showsVerticalScrollIndicator={false}>
        </ListView>
        <Modal
          animationType={'fade'}
          visible={this.state.modalVisible}
          onRequestClose={() => { this._setModalVisible(false) }}>
          <View style={styles.modalContainer}>
            <Icon
              onPress={this._closeModal}
              name='ios-close-outline'
              style={styles.closeIcon} />
            <View style={styles.commentBox}>
              <View style={styles.comment}>
                <TextInput
                  placeholder='评论一下...'
                  style={styles.content}
                  multiline={true}
                  defaultValue={this.state.content}
                  onChangeText={this._input} />
              </View>
            </View>
            <Button style={styles.submitBtn} onPress={this._submit}>评论</Button>
          </View>
        </Modal>
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
    backgroundColor: '#ccc',
    position: 'absolute',
    bottom: 0
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
  },
  // 评论
  commentBox: {
    marginTop: 10,
    marginBottom: 10,
    padding: 8,
    width: width
  },
  content: {
    paddingLeft: 5,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    fontSize: 14,
    height: 80
  },
  commentArea: {
    width: width,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  // modal
  modalContainer: {
    flex: 1,
    paddingTop: 45,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  closeIcon: {
    alignSelf: 'center',
    fontSize: 30,
    lineHeight: 40,
    color: '#05a5d1',
    borderWidth: 1,
    borderColor: '#ddd',
    width: 40,
    height: 40,
    borderRadius: 20,
    textAlign: 'center'
  },
  submitBtn: {
    width: width - 20,
    padding: 16,
    borderRadius: 4,
    fontSize: 18,
    color: '#fff',
    backgroundColor: '#05a5d1',
    overflow: 'hidden'
  }
});

module.exports = Detail