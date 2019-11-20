import React, {Component} from 'react';
import {Image, Text, View, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import {fetchRequest} from '../config/FetchUtils';
import {Button, InputItem, List, Toast, Provider, Modal} from '@ant-design/react-native';
import AsyncStorage from "@react-native-community/async-storage";
import ImagePicker from 'react-native-image-crop-picker';
import base64 from 'react-native-base64'
import CommonUpload from './components/commonUpload'

export default class test1 extends Component {
    constructor(props) { // 初始化数据
        super(props);
        this.state = {
            ossConfig: {},
            image: ''
        }
    }

    componentWillMount() { // 即将要渲染虚拟DOM，在render函数前，只执行一次
    }

    //已经加载虚拟DOM，在render之后，只执行一次，可在此完成异步网络请求或集成其他JavaScript库
    componentDidMount() {
    }
    getImagePath(image) {
        console.log(image,'filePath')
    }
    render() {
        return (
            <Provider>
                <Text onPress={()=>{
                    this.refs.app.console()
                }}>测试组件传值</Text>
                <CommonUpload ref='app'  getImagePath={this.getImagePath.bind(this)}></CommonUpload>
            </Provider>
        );
    }
}
const {width, height, scale} = Dimensions.get('window');
const styles = StyleSheet.create({
});
