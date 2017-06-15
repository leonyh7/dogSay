/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import TabBar from './components/tabBar';

var Son = React.createClass ({
  getDefaultProps(){},

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome} onPress={this.props.timesPlus}>
          儿子： 有本事揍我啊
        </Text>
        <Text style={styles.welcome}>
          你居然揍我 {this.props.times} 次
        </Text>
        <Text style={styles.welcome} onPress={this.props.timesReset}>
          信不信我亲亲你
        </Text>
      </View>
    );
  }
})

var reactDemo2 = React.createClass({
  getDefaultProps() {},

  getInitialState() {
    return {
      hit: true,
      times: 2
    }
  },
  timesReset() {
    this.setState({
      times: 0
    })
  },
  willHit() {
    this.setState({
      hit: !this.state.hit
    })
  },
  timesPlus() {
    let times = this.state.times + 3
    this.setState({
      times
    })
  },
  render() {
    return (
      <View style={styles.container}>
        {
          this.state.hit ? <Son times={this.state.times} timesReset={this.timesReset} timesPlus={this.timesPlus} /> : null
        }
        <Text style={styles.welcome} onPress={this.timesReset}>
          老子说：心情好放你一马
        </Text>
        <Text style={styles.welcome} onPress={this.willHit}>
          到底揍不揍
        </Text>
        <Text style={styles.welcome}>
          就揍了你 {this.state.times} 次而已
        </Text>
        <Text style={styles.welcome} onPress={this.timesPlus}>
          不听话，再揍你 3 次
        </Text>
      </View>
    );
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('reactDemo2', () => reactDemo2);
