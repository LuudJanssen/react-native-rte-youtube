/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import { WebView, Platform, StyleSheet, Text, View } from 'react-native';
import loadLocalResource from 'react-native-local-resource';
import Page from './resources/rte.html';
import CSS from './resources/css.html';
import JS from './resources/js.html';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {

    state = {
        data: null
    };

    componentDidMount() {
        /*Promise.all([loadLocalResource(Page), loadLocalResource(CSS), loadLocalResource(JS)]).then((recourses) => {
            this.setState({ data: recourses[0].replace('<CSS></CSS>', recourses[1]).replace('<JS></JS>', recourses[2]) });
        });*/
        loadLocalResource(Page).then((r) => loadLocalResource(CSS).then((c) => loadLocalResource(JS).then((j) => {
            this.setState({
                data: r.replace('<CSS></CSS>', c).replace('<JS></JS>', j)
            });
        })));
    }


    render() {
        if (this.state.data === null) {
            return <View><Text>Loading...</Text></View>;
        }

        // this is the content you want to show after the promise has resolved
        return (
            <WebView
                onMessage={(event) => console.log((event.nativeEvent.data))}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onError={ev => console.log(ev)}
                source={{ html: this.state.data }}
            />
        );
    }
}