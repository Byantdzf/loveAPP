import React, {Component} from 'react';
import {Image, Text, View, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import {fetchRequest} from '../../config/FetchUtils';
import {Button, InputItem, List, Toast, Provider, Modal} from '@ant-design/react-native';
import AsyncStorage from "@react-native-community/async-storage";

export default class commonText extends Component {
    constructor(props) { // 初始化数据
        super(props);
        this.state = {
        }
    }

    componentWillMount() { // 即将要渲染虚拟DOM，在render函数前，只执行一次
    }

    //已经加载虚拟DOM，在render之后，只执行一次，可在此完成异步网络请求或集成其他JavaScript库
    componentDidMount() {
    }

    render() {
        return (
            <View>
                <Text>测试文件</Text>
            </View>
        );
    }
}
const {width, height, scale} = Dimensions.get('window');
const styles = StyleSheet.create({
});
