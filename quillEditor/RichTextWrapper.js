import React, {Component} from 'react';
import {StyleSheet, ActivityIndicator, View, WebView} from 'react-native';
import loadLocalResource from 'react-native-local-resource';
import Page from './resources/rte.html';
import CSS from './resources/css.html';
import JS from './resources/js.html';
import ImagePicker from "react-native-image-picker";

type Props = {};
export default class RichTextWrapper extends Component<Props> {
    constructor(props) {
        super(props);
        this.webView = React.createRef();
        this.state = {
            data: null,
            rteContent: this.props.contents,
        };
    }

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

    saveContents(data) {
        this.setState({
            rteContent: data,
        });
    }

    onContentsChange(content) {
        this.props.onContentsChange(content);
    }

    setStyles() {
        this.sendMessage('setStyles', style);
    }

    pickImage() {
        ImagePicker.showImagePicker({}, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                this.log('User cancelled image picker');
            } else if (response.error) {
                this.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                this.log('User tapped custom button: ', response.customButton);
            } else {
                const source = `data:image/jpeg;base64,${response.data}`;
                this.sendMessage('quill#insertEmbed', [10, 'image', source]);
            }
        });
    }

    componentDidMount() {
        Promise.all([loadLocalResource(Page), loadLocalResource(CSS), loadLocalResource(JS)])
            .then((resources) => {
                this.setState({
                    data: resources[0].replace('"QUILLCONFIG"', JSON.stringify(this.props.config))
                        .replace('<CSS></CSS>', resources[1])
                        .replace('<JS></JS>', resources[2])
                        .replace("QUILLSTYLE", this.convertStyle(this.props.style))
                        .replace('"QUILLCONTENTS"', JSON.stringify(this.props.contents || {}))
                });

                // this.sendMessage('setStyles', [style]);
            });
    }

    render() {
        if (this.state.data === null) {
            return (
                <View>
                    <ActivityIndicator size="large" color="blue"/>
                </View>
            );
        }

        // this is the content you want to show after the promise has resolved
        return (
            <WebView
                ref={this.webView}
                onMessage={ev => this.receiveMessage(ev, (name, data) => {
                    this.log(name, data);
                    if (name.startsWith('app#')) {
                        const fnName = name.split('app#')[1];
                        this.log(fnName, ...data);
                        this[fnName](...data);
                    }
                })}
                //onLoad={this.props.contents && this.sendMessage('quill#setContents', [this.props.contents])}
                javaScriptEnabled
                domStorageEnabled
                allowFileAccess
                onError={ev => console.log(ev)}
                source={{html: this.state.data}}
            />
        );
    }

    convertStyle(style) {
        if(!style) {
            return "width: 100%; height: 80vh;";
        }
        let styleString = "";

        for(let propName in style) {
            styleString += propName + ": " +style[propName] + "; ";
        }

        return styleString;
    }
}
