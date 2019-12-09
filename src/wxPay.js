import React, {Component} from 'react';
import {Image, Text, View, TouchableOpacity, StyleSheet, Dimensions, ScrollView, TouchableHighlight } from 'react-native';
import {fetchRequest} from '../config/FetchUtils';
import {Button, InputItem, List, Toast, Provider, Modal} from '@ant-design/react-native';
import AsyncStorage from "@react-native-community/async-storage";
import ImagePicker from 'react-native-image-crop-picker';
import base64 from 'react-native-base64'
import * as WeChat from 'react-native-wechat'
// const WeChat = require('react-native-wechat');
class OButton extends Component {
    render() {

        return (
            <TouchableHighlight
                style={styles.button}
                underlayColor="#a5a5a5"
                onPress={this.props.onPress}>
                <Text style={styles.buttonText}>{this.props.text}</Text>
            </TouchableHighlight>
        );
    }
}
export default class wxPay extends Component {
    constructor(props) { // 初始化数据
        super(props);
        this.state = {
        }
    }

    //已经加载虚拟DOM，在render之后，只执行一次，可在此完成异步网络请求或集成其他JavaScript库
    componentDidMount() {
        WeChat.registerApp('wx2aa846fb62df72c9');
    }

    render() {
        return (
            <Provider>
                <View style={{margin:20}}>
                    <Text style={styles.welcome}>
                        微信分享
                    </Text>
                    <OButton text='微信好友分享的文本'
                             onPress={() => {
                                 WeChat.isWXAppInstalled()
                                     .then((isInstalled) => {
                                         if (isInstalled) {
                                             WeChat.shareToSession({type: 'text', description: '测试微信好友分享的文本内容'})
                                                 .catch((error) => {
                                                     Alert.alert(error.message);
                                                 });
                                         } else {
                                             Toast.info('请安装微信');
                                         }
                                     });
                             }}
                    />
                    <OButton text='微信好友分享链接'
                             onPress={() => {
                                 WeChat.isWXAppInstalled()
                                     .then((isInstalled) => {
                                         if (isInstalled) {
                                             WeChat.shareToSession({
                                                 title:'微信好友测试的链接',
                                                 description: '分享的标题内容',
                                                 thumbImage: '分享的标题图片',
                                                 type: 'news',
                                                 webpageUrl: '分享的链接'
                                             })
                                                 .catch((error) => {
                                                     Alert.alert(error.message);
                                                 });
                                         } else {
                                             Toast.info('请安装微信');
                                         }
                                     });
                             }}
                    />
                    <OButton text='微信朋友圈分享的文本'
                             onPress={() => {
                                 WeChat.isWXAppInstalled()
                                     .then((isInstalled) => {
                                         if (isInstalled) {
                                             WeChat.shareToTimeline({type: 'text', description: '测试微信朋友圈分享的文本内容'})
                                                 .catch((error) => {
                                                     Alert.alert(error.message);
                                                 });
                                         } else {
                                             Toast.info('请安装微信');
                                         }
                                     });
                             }}
                    />
                    <OButton text='微信朋友圈分享的链接'
                             onPress={() => {
                                 WeChat.isWXAppInstalled()
                                     .then((isInstalled) => {
                                         if (isInstalled) {
                                             WeChat.shareToTimeline({
                                                 title:'分享的标题',
                                                 description: '分享的标题内容',
                                                 thumbImage: '分享的标题图片',
                                                 type: 'news',
                                                 webpageUrl: '分享的链接'
                                             })
                                                 .catch((error) => {
                                                     Alert.alert(error.message);
                                                 });
                                         } else {
                                             Toast.info('请安装微信');
                                         }
                                     });
                             }}
                    />

                    <OButton text='微信支付'
                             onPress={() => {
                                 WeChat.isWXAppInstalled()
                                     .then((isInstalled) => {
                                         if (isInstalled) {
                                             WeChat.pay({
                                                 partnerId: 'xxxxxx',  // 商家向财付通申请的商家id
                                                 prepayId: 'xxxxxx',   // 预支付订单
                                                 nonceStr:'xxxxxx',   // 随机串，防重发
                                                 timeStamp: 'xxxxxxx'    ,  // 时间戳，防重发.
                                                 package: 'Sign=WXPay',    // 商家根据财付通文档填写的数据和签名
                                                 sign: 'xxxxxxxxx'       // 商家根据微信开放平台文档对数据做的签名
                                             }).then((requestJson)=>{
                                                 //支付成功回调
                                                 if (requestJson.errCode=="0"){
                                                     //回调成功处理
                                                 }
                                             }).catch((err)=>{
                                                 Toast.info('支付失败')
                                             })
                                         } else {
                                             Toast.info('请安装微信');
                                         }
                                     });

                             }}
                    />
                </View>

            </Provider>
        );
    }
}
const {width, height, scale} = Dimensions.get('window');
const styles = StyleSheet.create({
    welcome: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#d92553',
        padding: 22
    },
    button: {
        padding: 22,
        backgroundColor: '#f5f6f9',
        width: width * .48,
        marginBottom: 12,
    }
});
