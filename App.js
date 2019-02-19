/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import RichTextWrapper from "./quillEditor/RichTextWrapper";

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
    render() {
        return (
            <View style={{...StyleSheet.absoluteFill}}>
                <RichTextWrapper
                    contents={{ops: [{insert:'fgfasdjhs jhksdfjhj'}]}}
                    onContentsChange={contents => {
                        console.log(contents);
                    }}
                    config={{
                        modules: {
                            toolbar: [
                                [{ header: [1, 2, false] }],
                                ['bold'], ['italic'], ['underline'],
                                ['image'], ['video']
                            ]
                        },
                        theme: 'snow', // or 'bubble'
                        placeholder: 'Placeholder!'
                    }}
                    style={{
                        width: '50px',
                        height: '50px',
                    }}
                />
            </View>
        );
    }
}
