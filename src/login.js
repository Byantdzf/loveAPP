import React, {Component} from 'react';
import {Image, Text, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import {Actions} from "react-native-router-flux";
import {fetchRequest} from '../config/FetchUtils';
import {Button, InputItem, List, Toast, Provider} from '@ant-design/react-native';
// import DeviceStorage from '../config/DeviceStorage';
import AsyncStorage from "@react-native-community/async-storage";

export default class login extends Component {
    constructor(props) { // 初始化数据
        super(props);
        this.state = {
            text: '获取验证码',
            mobile: '15707534403',
            code: '999999999',
            timer: '',
            time: 60,
            codeActive: true,
        }
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
        if (!this.state.code){
            Toast.offline('请输入正确的验证码');
            return
        }
        console.log(this.state.mobile.replace(/\s+/g, ""))
        console.log(this.state.code)
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
        // console.log('componentDidMount...')
        // DeviceStorage.get('token').then((res) => {
        //     console.log(res)
        //     // if (res == null || res == '') {
        //     //     setTimeout(() => {
        //     //         Actions.login()
        //     //     }, 800)
        //     // } else {
        //     //     setTimeout(() => {
        //     //         Actions.home()
        //     //     }, 800)
        //     // }
        // })
    }

    render() {
        let backPic = {uri: 'https://images.ufutx.com/201910/17/d4833066733d2ab4454e84f598a7cb32.jpeg'};
        let phoneIcon = {uri: 'https://images.ufutx.com/201910/17/b5e1739e7dec78ba0c6f59cf6b2c576a.png'};
        let codeIcon = {uri: 'https://images.ufutx.com/201910/17/0fdfd6313dcf3045f69da3dcbc0244e6.png'};
        return (
            <Provider>
                <View style={{backgroundColor: '#ffffff', flex: 1}}>
                    <Image source={backPic} style={styles.backPic}/>
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
                    <View style={{height: 72}}></View>
                    <TouchableOpacity onPress={() => {
                        this.login()
                    }}>
                        <View style={styles.btnStyle}>
                            <Text style={styles.textStyle}>点击登录</Text>
                        </View>
                    </TouchableOpacity>
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
