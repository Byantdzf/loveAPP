/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
type Props = {};
export default class IOS extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome} onPress={()=>Actions.IOS()}>
                    adnroid首页
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
