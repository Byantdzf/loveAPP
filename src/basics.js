import React, {Component} from 'react';
import {Image, Text, View, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, TextInput } from 'react-native';
import {Actions} from "react-native-router-flux";
import {fetchRequest} from '../config/FetchUtils';
import {Button, InputItem, List, Toast, Provider} from '@ant-design/react-native';
import DeviceStorage from '../config/DeviceStorage';
import Pickers from '../config/Picker'
export default class login extends Component {
    constructor(props) { // 初始化数据
        super(props);
        this.state = {
            name: '1222222',
            sex: '男',
            belief: '其他'
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
        fetchRequest('official/app/login ', 'POST', data)
            .then(res => {
                console.log(res)
                if (res.code == 1){
                    Toast.offline(res.message);
                    this.inputRef.focus();
                    return
                } else {
                    Toast.success('登录成功');
                    DeviceStorage.save("token", res.data.token);
                    DeviceStorage.save("user", res.data.user);
                    Actions.gray()
                }
            }).catch(err => {
            console.log(`异常: ${err}`);
        })
    }

    selectSex() {
        Pickers.show(['男', '女'], this.state.sex, (value) => {
            this.setState({
                sex: value,
            });
        })
    }

    selectBelief() {
        let beliefs = ['基督教', '佛教', '伊斯兰教', '其他']
        Pickers.show(beliefs, this.state.belief, (value) => {
            this.setState({
                belief: value,
            });
        })
    }

    componentWillMount() { // 即将要渲染虚拟DOM，在render函数前，只执行一次
        // console.log('componentWillMount...')
    }

    //已经加载虚拟DOM，在render之后，只执行一次，可在此完成异步网络请求或集成其他JavaScript库
    componentDidMount() {
        // console.log('componentDidMount...')
    }

    render() {
        let backPic = {uri: 'https://images.ufutx.com/201910/17/d4833066733d2ab4454e84f598a7cb32.jpeg'};
        let codeIcon = {uri: 'https://images.ufutx.com/201910/17/70c4a203145a1bbc535b0524a5133bee.png'};
        return (
            <Provider>
                <View style={{backgroundColor: '#ffffff', height: height,}}>
                    <Image source={backPic} style={styles.backPic}/>
                    <View style={[styles.touchConainer, {width: width * .8}]}>
                        <Text style={{color: '#666'}}>基本资料</Text>
                        <List style={styles.box}  renderHeader={'基本资料'}>
                            <InputItem
                                clear
                                error
                                type="phone"
                                value={this.state.mobile}
                                onChange={value => {
                                    this.setState({
                                        mobile: value,
                                    });
                                }}
                                placeholder="手机号"
                            >
                                {/*<Image source={phoneIcon} style={styles.icon}/>*/}
                            </InputItem>
                        </List>
                        <View style={styles.listItem}>
                            <Text style={{fontSize: 16, width: width * .2}}>昵称</Text>
                            <TextInput
                                style={[styles.textInput, {width: width * .42,}]}
                                onChangeText={value => {
                                    this.setState({
                                        name: value,
                                    });
                                    console.log(this.state.name)
                                }}
                                onPress={() => {
                                    Pickers.hide()
                                }}
                                defaultValue={this.state.name}
                            />
                            <Image source={codeIcon} style={styles.icon}/>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={{fontSize: 16, width: width * .2,}}>性别</Text>
                            <Text style={[styles.textInput, {width: width * .42,}]} onPress={() => {
                                this.selectSex()
                            }}>
                                {this.state.sex}
                            </Text>
                            <Image source={codeIcon} style={styles.icon}/>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={{fontSize: 16, width: width * .2,}}>信仰</Text>
                            <Text style={[styles.textInput, {width: width * .42,}]} onPress={() => {
                                this.selectBelief()
                            }}>
                                {this.state.belief}
                            </Text>
                            <Image source={codeIcon} style={styles.icon}/>
                        </View>
                        <View style={styles.listItem}>
                            <Text style={{fontSize: 16, width: width * .2,}}>出生日期</Text>
                            <TextInput style={[styles.textInput, {width: width * .42,}]} onChangeText={value => {
                                    this.setState({
                                        name: value,
                                    });
                                    console.log(this.state.name)
                                }}
                                defaultValue={this.state.name}
                            />
                            <Image source={codeIcon} style={styles.icon}/>
                        </View>
                        <View style={{height: 32}}></View>
                        <TouchableOpacity onPress={() => {
                            this.login()
                        }}>
                            <View style={styles.btnStyle}>
                                <Text style={styles.textStyle}>寻找心仪的TA</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Provider>
        );
    }
}
const {width, height, scale} = Dimensions.get('window');
const styles = StyleSheet.create({
    touchConainer: {
        backgroundColor: '#fff',
        alignSelf: 'center',
        shadowColor:'#000000'
    },
    textInput: {
        // backgroundColor: 'pink',
        padding: 0,
        textAlign: 'right',
        color: '#666',
        marginTop: -2,
        marginLeft: 32,
        fontSize: 16,
        // borderBottomWidth: .5,
        // borderBottomColor: '#666'
    },
    backPic: {
        height: 269,
        zIndex: 999,
    },
    listItem: {
        marginTop: 18,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        flexDirection: 'row'
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
        marginTop: 4,
        width: 16,
        height: 16,
    }
});

// export default () => (
//     <Provider>
//         <login />
//     </Provider>
// );
