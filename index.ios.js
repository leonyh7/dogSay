'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  AppRegistry,
  NavigatorIOS,
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
          title="list"
          iconName="ios-videocam-outline"
          selectedIconName="ios-videocam"
          selected={this.state.selectedTab === 'list'}
          onPress={() => {
            this.setState({
              selectedTab: 'list',
            });
          }}>
          <NavigatorIOS
            initialRoute={{
              title: '列表页面',
              component: List            
            }}
            style={{ flex: 1 }}
            barTintColor='#05a5d1'
            titleTextColor='#fff'
            shadowHidden={true}
            //navigationBarHidden={true}
          />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="edit"
          iconName="ios-recording-outline"
          selectedIconName="ios-recording"
          selected={this.state.selectedTab === 'edit'}
          onPress={() => {
            this.setState({
              selectedTab: 'edit',
            });
          }}>
          <Edit></Edit>
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="accout"
          iconName="ios-more-outline"
          selectedIconName="ios-more"
          selected={this.state.selectedTab === 'account'}
          onPress={() => {
            this.setState({
              selectedTab: 'account',
            });
          }}>
          <Account></Account>
        </Icon.TabBarItem>
      </TabBarIOS>
    );
  },

});

AppRegistry.registerComponent('reactDemo2', () => reactDemo2);

