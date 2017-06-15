var React = require('react');
var ReactNative = require('react-native');
var {
  StyleSheet,
  Text,
  View,
} = ReactNative;

var Edit = React.createClass({
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text>编辑页面</Text>
        </View>
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  header: {
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#F5FCFF'
  },

  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600'
  }
});

module.exports = Edit