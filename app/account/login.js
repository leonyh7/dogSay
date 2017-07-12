var React = require('react');
var ReactNative = require('react-native');
var {
  AlertIOS,
  StyleSheet,
  Text,
  TextInput,
  View,
} = ReactNative;

var Button = require('react-native-button').default
var CountDown = require('react-native-sk-countdown').CountDownText

var request = require('../common/request')
var config = require('../common/config')

var Login = React.createClass({
  getInitialState() {
    return {
      verifyCode: '',
      phoneNumer: '',
      codeSent: false
    }
  },
  // 验证登录
  _submit() { },
  // 显示验证码框
  _showVerifyCode() {
    this.setState({
      codeSent: true
    })
  },
  // 获取验证码
  _sendVerifyCode() {
    var phoneNumer = this.state.phoneNumer

    if (!phoneNumer) {
      return AlertIOS.alert('手机号不能为空！')
    }

    var body = {
      phoneNumer: phoneNumer
    }

    request.post(config.host + config.api.signup)
      .then((data) => {
        if (data && data.success) {
          this._showVerifyCode()
        } else {
          AlertIOS.alert('获取验证码失败，请检查手机号是否正确')
        }
      }).catch((err) => {
        AlertIOS.alert('获取验证码失败，请检查网络是否良好')
      })

  },
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.signupBox}>
          <Text style={styles.title}>快速登录</Text>
          <TextInput
            placeholder="输入手机号"
            autoCaptialize={'none'}
            autoCorrect={false}
            keyboardType={'number-pad'}
            style={styles.inputField}
            onChangeText={(text) => {
              this.setState({
                phoneNumer: text
              })
            }}>
          </TextInput>

          {
            this.state.codeSent
              ? (<View style={styles.verifyCodeBox}>
                <TextInput
                  placeholder="输入验证码"
                  autoCaptialize={'none'}
                  autoCorrect={false}
                  keyboardType={'number-pad'}
                  style={styles.inputField}
                  onChangeText={(text) => {
                    this.setState({
                      verifyCode: text
                    })
                  }}></TextInput>
                {
                  this.state.countingDone
                    ? <Button
                      style={styles.countBtn}
                      onPress={this._sendVerifyCode}
                    >获取验证码</Button>
                    : <CountDown
                      style={styles.countBtn}
                      countType="seconds"
                      auto={true}
                      afterEnd={this._contingDone}
                      timeLeft={60}
                      step={-1}
                      startText='获取验证码'
                      endText='获取验证码'
                      intervalText={(text)=>'剩余秒数'+sec+'秒重新获取'}
                    />
                }
              </View>) : null}

          {
            this.state.codeSent
              ? <Button style={styles.btn} onPress={this._submit}>登录</Button>
              : <Button style={styles.btn} onPress={this._sendVerifyCode}>获取验证码</Button>
          }
        </View>
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 10
  },
  signupBox: {
    marginTop: 30,
  },
  title: {
    marginBottom: 20,
    color: '#333',
    fontSize: 20,
    textAlign: 'center',
  },
  inputField: {
    height: 40,
    padding: 5,
    color: '#666',
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginBottom: 10,
  },
  btn: {
    padding: 10,
    backgroundColor: 'transparent',
    borderColor: '#05a5d1',
    borderWidth: 1,
    borderRadius: 4,
    color: '#05a5d1'
  }
});

module.exports = Login