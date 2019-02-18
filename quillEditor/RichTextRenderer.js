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
        onMessage={event => console.log(JSON.parse(event.nativeEvent.data))}
        javaScriptEnabled
        domStorageEnabled
        scalesPageToFit
        allowFileAccess
        style={style.input}
        onError={ev => console.log(ev)}
        source={{ html: this.state.data }}
      />
    );
  }
}
