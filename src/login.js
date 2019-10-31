import React, {Component} from 'react';
import {Image, Text, View, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import {Actions} from "react-native-router-flux";
import {fetchRequest} from '../config/FetchUtils';
import {Button, InputItem, List, Toast, Provider, Modal} from '@ant-design/react-native';
// import DeviceStorage from '../config/DeviceStorage';
import AsyncStorage from "@react-native-community/async-storage";

export default class login extends Component {
    constructor(props) { // 初始化数据
        super(props);
        this.state = {
            text: '获取验证码',
            mobile: '',
            code: '',
            timer: '',
            time: 60,
            codeActive: true,
            visible: true,
            protocol: false,
        }
        this.selectBtn = () => {
            this.setState({
                protocol: !this.state.protocol,
            });
        };
        this.onClose = () => {
            this.setState({
                visible: false,
            });
        };
    }
    getCode() {
        if (!this.state.mobile) {
            Toast.offline('请先输入手机号');
            return
        }
        if (!this.state.codeActive) {
            return
        }
        let data = {
            mobile: this.state.mobile.replace(/\s+/g, "")
        }
        fetchRequest('official/sms/register', 'POST', data)
            .then(res => {
                console.log(res)
                if (res.code == 1){
                    Toast.offline('手机号无效');
                    return
                }
                this.setState({
                    text:  '秒后重试'
                });
                this.setState({
                    codeActive: !this.state.codeActive
                });
                this.inputRef.focus();
                this.state.timer = setInterval(() => {
                    this.setState({
                        time:  this.state.time-1
                    });
                    if (this.state.time == 0){
                        this.setState({
                            time:  60
                        });
                        clearInterval(this.state.timer)
                        this.setState({
                            text:  '获取验证码'
                        });
                        this.setState({
                            codeActive: !this.state.codeActive
                        });
                    }
                }, 1000);
            }).catch(err => {
            console.log(`异常: ${err}`);
        })
    }
    login() {
        if (!this.state.mobile){
            Toast.offline('请输入正确的手机号');
            return
        }
        if (!this.state.code){
            Toast.offline('请输入正确的验证码');
            return
        }
        console.log(this.state.mobile.replace(/\s+/g, ""))
        console.log(this.state.code)
        if (!this.state.protocol) {
            Toast.info('请阅读并勾选《用户服务协议》');
            return
        }
        let data = {
            mobile: this.state.mobile.replace(/\s+/g, ""),
            code: this.state.code
        }
        Toast.loading('登录中...', .6);
        fetchRequest('official/app/login', 'POST', data)
            .then(res => {
                console.log(res)
                if (res.code == 1){
                    Toast.offline(res.message);
                    this.inputRef.focus();
                    return
                } else {
                    Toast.success('登录成功');
                    let {token} = res.data
                    AsyncStorage.setItem('token', token, function (error) {
                        if (error) {
                            console.log('存储失败');
                        } else {
                            Actions.basics()
                        }
                    })
                    // DeviceStorage.save("token", res.data.token);
                    // DeviceStorage.save("user", res.data.user);
                }
            }).catch(err => {
            console.log(`异常: ${err}`);
        })
    }

    componentWillMount() { // 即将要渲染虚拟DOM，在render函数前，只执行一次
        // console.log('componentWillMount...')
    }

    //已经加载虚拟DOM，在render之后，只执行一次，可在此完成异步网络请求或集成其他JavaScript库
    componentDidMount() {
        // this.onButtonClick()
        // console.log('componentDidMount...')
    }

    render() {
        const footerButtons = [
            // { text: '不同意', style:'color:#666666', onPress: () => console.log('cancel') },
            { text: '同意并继续', onPress: () => this.setState({protocol:  true}) },
        ];
        let backPic = {uri: 'https://images.ufutx.com/201910/17/d4833066733d2ab4454e84f598a7cb32.jpeg'};
        let phoneIcon = {uri: 'https://images.ufutx.com/201910/29/d310337e34860095443fda22ec8b921b.png'};
        let codeIcon = {uri: 'https://images.ufutx.com/201910/29/483ba927a76a7f101d4e69ba88a48c68.png'};
        let selectIcon = {uri: this.state.protocol ? 'https://images.ufutx.com/201910/29/823d097f657a89469236aac302276fe8.png' : 'https://images.ufutx.com/201910/29/d1859324dc42ae4a4965c77f6a081e10.png'}

        return (
            <Provider>
                <View style={{backgroundColor: '#ffffff', flex: 1}}>
                    <Image source={backPic} style={styles.backPic}/>
                    <ScrollView                           // or ListView
                        keyboardDismissMode="on-drag"
                        keyboardShouldPersistTaps={true}>
                        <List style={styles.box}>
                            <InputItem
                                clear
                                type="phone"
                                styles={{color: '#fff'}}
                                value={this.state.mobile}
                                onChange={value => {
                                    this.setState({
                                        mobile: value,
                                    });
                                }}
                                placeholder="手机号"
                            >
                                <Image source={phoneIcon} style={styles.icon}/>
                            </InputItem>
                        </List>
                        <List style={styles.box}>
                            <InputItem
                                type="number"
                                maxLength = {9}
                                value={this.state.code}
                                styles={styles.codeInput}
                                onChange={value => {
                                    this.setState({
                                        code: value,
                                    });
                                }}
                                ref={el => (this.inputRef = el)}
                                placeholder="验证码"
                                extra={<Text style={{color: this.state.codeActive == true ? '#D92553' : '#bfbfbf'}}
                                             onPress={() => {
                                                 this.getCode()
                                             }}>{this.state.codeActive == true ? this.state.text : (this.state.time + this.state.text)}</Text>}
                            >
                                <Image source={codeIcon} style={styles.icon}/>
                            </InputItem>
                        </List>
                        <View style={[styles.box,{flexDirection: 'row',alignContent: 'flex-end'}]}>
                            <TouchableOpacity onPress={this.selectBtn}>
                                <Image source={selectIcon} style={{width: 20,height: 20,}}/>
                            </TouchableOpacity>
                            <Text style={styles.privacy} onPress={this.selectBtn}>我已阅读并同意</Text>
                            <Text style={[styles.privacy,{color: '#d92553'}]} onPress={()=>{Actions.protocol()}}>《用户服务协议》</Text>
                        </View>
                        <View style={{height: 42}} ></View>
                        <TouchableOpacity onPress={() => {this.login()}}>
                            <View style={styles.btnStyle}>
                                <Text style={styles.textStyle}>点击登录</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                    <Modal
                        title="温馨提示"
                        transparent
                        onClose={this.onClose}
                        maskClosable
                        visible={this.state.visible}
                        closable
                        footer={footerButtons}
                    >
                        <View style={{ paddingVertical: 20 }}>
                            <Text style={styles.messageStyle}>        欢迎使用福恋App！在你使用时需要连接数据网络或者WLAN网络，产生的流量费用请咨询当地运营商。福恋公司非常重视你的隐私保护和个人信息保护。在你使用福恋App服务前，请认真阅读
                                <Text style={{color: '#d92553'}} onPress={()=>{Actions.protocol()}}> 《用户服务协议》 </Text>，你同意并接受该条款后再开始使用我们的服务。
                            </Text>
                        </View>
                    </Modal>
                </View>
            </Provider>
        );
    }
}
const {width, height, scale} = Dimensions.get('window');
const styles = StyleSheet.create({
    codeInput: {
        width: 80,
        marginLeft: 12,
        borderBottomColor: '#fff',
    },
    privacy: {
        marginLeft: 4,
        marginTop: 1,
        color: '#bbbbbb'
    },
    messageStyle: {
        color: '#666',
        fontSize: 16,
        lineHeight: 28,
        marginBottom: -18,
        marginTop: -8,
    },
    backPic: {
        height: 269,
        zIndex: 999,
    },
    box: {
        width: 280,
        zIndex: 999,
        marginTop: 12,
        marginBottom: 16,
        alignSelf: 'center',
        borderTopColor: '#fff',
    },
    textStyle: {
        width: 200,
        textAlign: 'center',
        justifyContent: 'center',
        margin: 5,
        color: '#fff',
        fontSize: 14,
    },
    btnStyle: {
        width: 160,
        backgroundColor: '#D92553',
        alignSelf: 'center',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
        padding: 4,
        borderRadius: 4,
    },
    icon: {
        width: 20,
        height: 20,
        marginLeft: 12,
    }
});

// export default () => (
//     <Provider>
//         <login />
//     </Provider>
// );
