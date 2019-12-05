import React, {Component} from 'react';
import {Image, Text, View, TouchableOpacity, StyleSheet, Dimensions, ScrollView, TouchableHighlight} from 'react-native';
import {fetchRequest} from '../config/FetchUtils';
import {Button, InputItem, List, Toast, Provider, Modal} from '@ant-design/react-native';
import AsyncStorage from "@react-native-community/async-storage";
import ImagePicker from 'react-native-image-crop-picker';
import base64 from 'react-native-base64'
import * as WeChat from 'react-native-wechat'
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
export default class wxpay extends Component {
    constructor(props) { // 初始化数据
        super(props);
        this.state = {
        }
    }

    componentWillMount() { // 即将要渲染虚拟DOM，在render函数前，只执行一次
    }

    //已经加载虚拟DOM，在render之后，只执行一次，可在此完成异步网络请求或集成其他JavaScript库
    componentDidMount() {
        // WeChat.registerApp('wx2aa846fb62df72c9');
    }
    render() {
        return (

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
                                                 Toast.info(error.message);
                                             });
                                     } else {
                                         Toast.fail('请安装微信');
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
                                             title:'兄弟！福利来咯！',
                                             description: '点进来看看我给你留的惊喜吧...',
                                             thumbImage: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3372687940,2485060542&fm=26&gp=0.jpg',
                                             type: 'news',
                                             webpageUrl: 'https://image.baidu.com/search/detail?ct=503316480&z=0&ipn=false&word=%E7%BE%8E%E5%A5%B3&hs=2&pn=5&spn=0&di=115170&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&ie=utf-8&oe=utf-8&cl=2&lm=-1&cs=3372687940%2C2485060542&os=1256600239%2C202548050&simid=4068587144%2C524094900&adpicid=0&lpn=0&ln=30&fr=ala&fm=&sme=&cg=girl&bdtype=0&oriquery=%E7%BE%8E%E5%A5%B3&objurl=http%3A%2F%2Fpic.rmb.bdstatic.com%2Fb7505a944990407c01990007e1553e4d.png&fromurl=ippr_z2C%24qAzdH3FAzdH3Fkwt3twiw5_z%26e3Bkwt17_z%26e3Bv54AzdH3Ff%3Ft1%3D8md9cdd88d98d8m9lcl%26ou6%3Dfrt1j6%26u56%3Drv&gsm=&islist=&querylist='
                                         })
                                             .catch((error) => {
                                                 Toast.info(error.message);
                                             });
                                     } else {
                                         Toast.fail('请安装微信');
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
                                                 Toast.info(error.message);
                                             });
                                     } else {
                                         Toast.fail('请安装微信');
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
                                                 Toast.info(error.message);
                                             });
                                     } else {
                                         Toast.fail('请安装微信');
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
                                             Toast.fail('请安装微信');
                                         })
                                     } else {
                                         Toast.fail('请安装微信');
                                     }
                                 });

                         }}
                />
            </View>

        );
    }
}
const {width, height, scale} = Dimensions.get('window');
const styles = StyleSheet.create({
    welcome: {
        padding: 12,
        fontSize: 22,
        color: '#57c980',
        fontWeight: 'bold'
    },
    button: {
        padding: 12,
        backgroundColor:'#fff',
        margin: 12,
    }
});
