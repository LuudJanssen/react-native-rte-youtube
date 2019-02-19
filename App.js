/**
 * Test App for RichTextWrapper
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from "react";
import { Platform, StyleSheet, View } from "react-native";
import RichTextWrapper from "./quillEditor/RichTextWrapper"; // this should become a npm package

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <RichTextWrapper
        onContentsChange={contents => {
          console.log("we can set this as state", contents);
        }}
        config={{
          modules: {
            //toolbar: false,
            toolbar: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline"],
              ["image", "video"]
            ]
          },
          theme: "snow", // or 'bubble'
          placeholder: "Placeholder!"
          //readOnly: true,
        }}
        style={{
          width: 300,
          height: 200
        }}
        contents={{
          ops: [
            {
              insert: "fgfasdjhs jhksdfjhj",
              attributes: {
                bold: true
              }
            }
          ]
        }}
        imagePickerConfig={{
          //https://github.com/react-native-community/react-native-image-picker/blob/master/docs/Reference.md#options
          title: "Kies een afbeelding",
          allowsEditing: true
        }}
      />
    );
  }
}
