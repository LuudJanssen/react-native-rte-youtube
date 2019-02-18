import React, { Component } from 'react';
import { StyleSheet, Text, View, WebView } from 'react-native';
import loadLocalResource from 'react-native-local-resource';
import ImagePicker from 'react-native-image-picker';
import Page from './resources/rte.html';
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
  constructor(props) {
    super(props);
    this.webView = React.createRef();
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    Promise.all([loadLocalResource(Page), loadLocalResource(CSS), loadLocalResource(JS)])
      .then((resources) => {
        this.setState({
          data: resources[0].replace('<CSS></CSS>', resources[1])
            .replace('<JS></JS>', resources[2]),
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
        ref={this.webView}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'addImage') {
            // ImagePicker.showImagePicker(null, (response) => {
            //   console.log('Response = ', response);
            //
            //   if (response.didCancel) {
            //     console.log('User cancelled image picker');
            //   } else if (response.error) {
            //     console.log('ImagePicker Error: ', response.error);
            //   } else if (response.customButton) {
            //     console.log('User tapped custom button: ', response.customButton);
            //   } else {
            //     const source = { uri: `data:image/jpeg;base64,${response.data}` };
            //
            //     // window.postMessage(source);
            //
            //     console.log(source);
            //   }
            // });
            console.log(event.nativeEvent.data);
            this.webView.current.postMessage('test');
          }

          console.log(event.nativeEvent.data);
        }}
        javaScriptEnabled
        domStorageEnabled
        scalesPageToFit
        style={style.input}
        onError={ev => console.log(ev)}
        source={{ html: this.state.data }}
      />
    );
  }
}
