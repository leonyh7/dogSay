'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
} = ReactNative;
var Icon = require('react-native-vector-icons/Ionicons');

var List = require('./app/creation/index');
var Edit = require('./app/edge/index');
var Account = require('./app/account/index');

var reactDemo2 = React.createClass({
  statics: {
    title: '<TabBarIOS>',
    description: 'Tab-based navigation.',
  },

  displayName: 'TabBarExample',

  getInitialState: function () {
    return {
      selectedTab: 'list'
    };
  },

  render: function () {
    return (
      <TabBarIOS
        unselectedTintColor="#666"
        tintColor="#05a5d1"
        barTintColor="white"
        style={{ backgroundColor: '#F5FCFF' }}>
        <Icon.TabBarItem
          iconName="ios-videocam-outline"
          selectedIconName="ios-videocam"
          selected={this.state.selectedTab === 'list'}
          onPress={() => {
            this.setState({
              selectedTab: 'list',
            });
          }}>
          <List />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName="ios-recording-outline"
          selectedIconName="ios-recording"
          selected={this.state.selectedTab === 'edit'}
          onPress={() => {
            this.setState({
              selectedTab: 'edit',
            });
          }}>
          <Edit />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName="ios-more-outline"
          selectedIconName="ios-more"
          selected={this.state.selectedTab === 'account'}
          onPress={() => {
            this.setState({
              selectedTab: 'account',
            });
          }}>
          <Account />
        </Icon.TabBarItem>
      </TabBarIOS>
    );
  },

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    margin: 50,
  },
});

AppRegistry.registerComponent('reactDemo2', () => reactDemo2);