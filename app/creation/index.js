'use strict';
var React = require('react');
var ReactNative = require('react-native');
var {
  ActivityIndicator,
  AlertIOS,
  AppRegistry,
  Dimensions,
  Image,
  ListView,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = ReactNative;

import Icon from 'react-native-vector-icons/Ionicons'
var Detail = require('./detail.js')

var request = require('../common/request')
var config = require('../common/config')


var width = Dimensions.get('window').width

var cachedResults = {
  nextPage: 1,
  items: [],
  total: 0
}
var Item = React.createClass({
  getInitialState() {
    var row = this.props.row
    return {
      up: row.up,
      row: row
    }
  },
  _up() {
    var up = !this.state.up
    var id = this.state.row._id
    var url = config.host + config.api.up

    var body = {
      id,
      up,
      accessToken: '11',
    }

    request.post(url, body)
      .then((data) => {
        if (data && data.success) {
          this.setState({
            up
          })
        } else {
          AlertIOS.alert('点赞失败！稍后重试')
        }
      })
      .catch((error)=>{
        console.log(error)
      })
  },
  render() {
    var row = this.state.row
    return (
      <TouchableHighlight onPress={this.props.onSelect}>
        <View style={styles.item}>
          <Text style={styles.title}>{row.title}</Text>
          <Image source={{ uri: row.thumb }} style={styles.thumb}>
            <Icon name='ios-play' size={28} style={styles.play}></Icon>
          </Image>
          <View style={styles.itemFooter}>
            <View style={styles.handelBox}>
              <Icon
                name={this.state.up ? 'ios-heart' : 'ios-heart-outline'}
                size={28}
                style={this.state.up ? styles.up : styles.down}
              ></Icon>
              <Text style={styles.handelText} onPress={this._up}>喜欢</Text>
            </View>
            <View style={styles.handelBox}>
              <Icon
                name='ios-chatboxes-outline'
                size={28}
                style={styles.comment}
              ></Icon>
              <Text style={styles.handelText}>评论</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
})

var List = React.createClass({
  getInitialState() {
    var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return {
      dataSource: ds.cloneWithRows([]),
      isLoadingTail: false,
      page: 1,
      isRefreshing: false,
      init: false
    };
  },
  _renderRow(row) {
    return (
      <Item key={row.id} onSelect={()=>this._loadPage(row)} row={row}></Item>
    );
  },
  componentDidMount() {
    this._fetchData(1)
  },
  _fetchData(page) {
    if (page !== 0) {// 上拉加载
      this.setState({
        isLoadingTail: true
      })
    } else { // 下拉刷新
      this.setState({
        isRefreshing: true
      })
    }
    request.get(config.host + config.api.creations, {
      accessToken: 'aa',
      page: page
    }).then((data) => {
      if (data.success) {
        var items = cachedResults.items.slice()

        if (page !== 0) {
          items = items.concat(data.data)
          cachedResults.nextPage += 1
        } else {
          items = data.data.concat(items)
        }

        cachedResults.items = items
        cachedResults.total = data.total

        setTimeout(() => {
          if (page !== 0) {
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(cachedResults.items),
              isLoadingTail: false
            })
          } else {
            this.setState({
              dataSource: this.state.dataSource.cloneWithRows(cachedResults.items),
              isRefreshing: false
            })
          }
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
  _fetchMoreData() {
    if (!this.state.init || !this._hasMore() || this.state.isLoadingTail) {
      this.state.init = true
      return
    }

    var page = cachedResults.nextPage
    this._fetchData(page)
  },
  _onRefresh() {
    if (!this._hasMore() || this.state.isRefreshing) {
      return
    }
    this._fetchData(0)
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
  _hasMore() {
    return cachedResults.items.length !== cachedResults.total
  },
  _loadPage(row){
    this.props.navigator.push({
      title: row.title,
      component: Detail,
      passProps: { data: row }
    })
  },
  render() {
    return (
      <View style={styles.container}>
        <ListView
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          onEndReached={this._fetchMoreData}
          onEndReachedThreshold={68}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
              tintColor="#ff6600"
              title="拼命加载中..."
            />
          }
          renderFooter={this._renderFooter}
          renderRow={this._renderRow}
          showsVerticalScrollIndicator={false}
        ></ListView>
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: 65,
    paddingBottom: 48
  },
  header: {
    backgroundColor: '#05a5d1'
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600'
  },
  item: {
    width: width,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  title: {
    padding: 10,
    fontSize: 18,
    color: '#333'
  },
  thumb: {
    width: width,
    height: width * 0.5,
    resizeMode: 'cover'
  },
  play: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 46,
    height: 46,
    paddingTop: 9,
    paddingLeft: 18,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 23,
    color: '#ed7b66'
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee'
  },
  handelBox: {
    padding: 10,
    flexDirection: 'row',
    width: width * 0.5 - 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  down: {
    fontSize: 22,
    color: '#333'
  },
  up: {
    fontSize: 22,
    color: '#ed7b66'
  },
  handelText: {
    paddingLeft: 12,
    fontSize: 18,
    color: '#333'
  },
  comment: {
    fontSize: 22,
    color: '#333'
  },
  loadingMore: {
    marginVertical: 20
  },
  loadingText: {
    color: '#777',
    textAlign: 'center'
  }
});

module.exports = List