import React, { Component } from 'react';
import { StyleSheet, Text, View, WebView } from 'react-native';
import loadLocalResource from 'react-native-local-resource';
import Page from './resources/rtr.html';
import CSS from './resources/css.html';
import JS from './resources/js.html';

const style = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    height: 300,
    borderRadius: 2,
    marginHorizontal: 20,
    marginVertical: 5,
    paddingVertical: 5,
  },
});

type Props = {};
export default class RichTextEditor extends Component<Props> {

  state = {
    data: null,
  };

  sendMessage(name, data) {
    const msg = { name, data };
    this.webView.current.postMessage(JSON.stringify(msg));
  }

  receiveMessage(event, callback) {
    let msg = { name: '', data: event.nativeEvent.data }
    try {
      msg = JSON.parse(event.nativeEvent.data);
    } catch (err) {
      console.log(err);
    }
    callback(msg.name, msg.data);
  }

  log(...params) {
    console.log(...params);
  }

  componentDidMount() {
    Promise.all([loadLocalResource(Page), loadLocalResource(CSS), loadLocalResource(JS)])
      .then((resources) => {
        this.setState({
          data: resources[0].replace('<CSS></CSS>', resources[1])
            .replace('<JS></JS>', resources[2])
        });
      });
  }

  render() {
    if (this.state.data === null) {
      return <View><Text>Loading...</Text></View>;
    }

    // this is the content you want to show after the promise has resolved
    return (
      <WebView
        onMessage={ev => this.receiveMessage(ev, (name, data) => {
          this.log(name, data);
          if (name.startsWith('app#')) {
            const fnName = name.split('app#')[1];
            this[fnName](...data);
          }
        })}
        javaScriptEnabled
        domStorageEnabled
        scalesPageToFit
        allowFileAccess
        style={{ ...StyleSheet.absoluteFill }}
        onError={ev => this.log(ev)}
        source={{ html: this.state.data }}
      />
    );
  }
}
