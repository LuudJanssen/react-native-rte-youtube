import React, { Component } from "react";
import { ActivityIndicator, View, WebView } from "react-native";
import loadLocalResource from "react-native-local-resource";
import Page from "./resources/rte.html";
import CSS from "./resources/css.html";
import JS from "./resources/js.html";
import ImagePicker from "react-native-image-picker";

export default class RichTextWrapper extends Component {
  constructor(props) {
    super(props);
    this.webView = React.createRef();
    this.state = {
      html: null,
      rteContent: this.props.contents
    };
  }

  sendMessage(name, data) {
    const msg = { name, data };
    this.webView.current.postMessage(JSON.stringify(msg));
  }

  receiveMessage(event, callback) {
    let msg = { name: "", data: event.nativeEvent.data };
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

  onContentsChange(content) {
    this.setState({
      rteContent: data
    });
    this.props.onContentsChange(content);
  }

  pickImage() {
    ImagePicker.showImagePicker(
      this.props.imagePickerConfig || {
        allowsEditing: true
      },
      response => {
        console.log("Response = ", response);

        if (response.didCancel) {
          this.log("User cancelled image picker");
        } else if (response.error) {
          this.log("ImagePicker Error: ", response.error);
        } else if (response.customButton) {
          this.log("User tapped custom button: ", response.customButton);
        } else {
          const source = `data:image/jpeg;base64,${response.data}`;
          this.sendMessage("insertImage", source);
        }
      }
    );
  }

  componentDidMount() {
    Promise.all([
      loadLocalResource(Page),
      loadLocalResource(CSS),
      loadLocalResource(JS)
    ]).then(resources => {
      this.setState({
        html: resources[0]
          .replace('"QUILLCONFIG"', JSON.stringify(this.props.config))
          .replace('"QUILLCONTENTS"', JSON.stringify(this.props.contents || {}))
          .replace("<CSS></CSS>", resources[1])
          .replace("<JS></JS>", resources[2])
      });
    });
  }

  render() {
    if (this.state.html === null) {
      return (
        <View>
          <ActivityIndicator size="large" color="blue" />
        </View>
      );
    }

    return (
      <View style={this.props.style}>
        <WebView
          ref={this.webView}
          style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0)" }}
          onMessage={ev =>
            this.receiveMessage(ev, (name, data) => {
              this.log(name, data);
              if (name.startsWith("app#")) {
                const fnName = name.split("app#")[1];
                const safeFunctions = {
                  log: this.log,
                  pickImage: this.pickImage,
                  onContentsChange: this.onContentsChange
                };

                if (!safeFunctions[fnName]) {
                  throw new Error(`Function '${fnName}' does not exist`);
                }

                this.log(fnName, ...data);
                safeFunctions[fnName](...data);
              }
            })
          }
          javaScriptEnabled
          domStorageEnabled
          allowFileAccess
          scalesPageToFit
          onError={ev => console.log(ev)}
          source={{ html: this.state.html }}
        />
      </View>
    );
  }
}
