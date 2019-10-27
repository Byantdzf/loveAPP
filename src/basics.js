import React, {Component} from 'react';
import {Image, Text, View, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, TextInput, DatePickerIOS} from 'react-native';
import {Actions} from "react-native-router-flux";
import {fetchRequest} from '../config/FetchUtils';
import {Button, InputItem, List, Toast, Provider} from '@ant-design/react-native';
import DeviceStorage from '../config/DeviceStorage';
import Pickers from '../config/Picker'
import DatePicker from 'react-native-datepicker'
import AsyncStorage from "@react-native-community/async-storage";
export default class login extends Component {
    constructor(props) { // 初始化数据
        super(props);
        this.state = {
            name: '',
            sex: '男',
            belief: '其他',
            datetime: '1990-01-01'
        }
    }
    login() {
        console.log()
        if (!this.state.name){
            Toast.offline('请填写昵称');
            this.inputRef.focus();
            return
        }
        // console.log(this.state.mobile.replace(/\s+/g, ""))
        // console.log(this.state.code)
        let data = {
            name: this.state.name,
            sex: this.state.sex === '男'? '1': '2',
            belief: this.state.belief,
            birthday: this.state.datetime
        }
        console.log(data)

        Toast.loading('保存信息中...', .8);

        fetchRequest('official/app/user/profile', 'POST', data)
            .then(res => {
                console.log(res)
                Toast.success('保存成功');
                Actions.home()
            }).catch(err => {
            console.log(`异常: ${err}`);
        })
    }

    selectSex() {
        Pickers.show(['男', '女'], this.state.sex, (value) => {
            console.log(value)
            this.setState({
                sex: value.join(','),
            });
        })
    }

    selectBelief() {
        let beliefs = ['基督教', '佛教', '伊斯兰教', '其他']
        Pickers.show(beliefs, this.state.belief, (value) => {
            this.setState({
                belief: value.join(','),
            });
        })
    }
    getUser() {
        fetchRequest('official/app/user/profile', 'GET')
            .then(res => {
                let {name,profile_courtship} = res.data
                console.log(profile_courtship)
                if (profile_courtship) {
                    this.setState({
                        name: name,
                        sex: profile_courtship.sex == 1?'男':'女',
                        belief: profile_courtship.belief,
                        datetime: profile_courtship.birthday,
                    });
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
        AsyncStorage.getItem('token', function (error, result) {
            console.log(error,result)
        })
        this.getUser()
    }

    render() {
        let backPic = {uri: 'https://images.ufutx.com/201910/17/d4833066733d2ab4454e84f598a7cb32.jpeg'};
        let codeIcon = {uri: 'https://images.ufutx.com/201910/17/70c4a203145a1bbc535b0524a5133bee.png'};
        return (
            <Provider>
                <View style={{backgroundColor: '#ffffff', height: height,}}>
                    <Image source={backPic} style={styles.backPic}/>
                    <View style={[styles.touchConainer, {width: width * .8}]}>
                        <Text style={{color: '#666', padding: 12, paddingTop: 0}}>基本资料</Text>
                        <List style={styles.box}  >
                            <InputItem
                                clear
                                erro
                                style={styles.InputItemStyle}
                                value={this.state.name}
                                ref={el => (this.inputRef = el)}
                                onChange={value => {
                                    this.setState({
                                        name: value,
                                    });
                                }}
                                placeholder="昵称"
                            >
                                昵称
                                {/*<Image source={phoneIcon} style={styles.icon}/>*/}
                            </InputItem>
                            <TouchableOpacity onPress={() => {this.selectSex()}}>
                                <InputItem
                                    value={this.state.sex}
                                    style={styles.InputItemStyle}
                                    editable={false}
                                    placeholder="性别"
                                >
                                    性别
                                </InputItem>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {this.selectBelief()}}>
                                <InputItem
                                    value={this.state.belief}
                                    style={styles.InputItemStyle}
                                    editable={false}
                                    placeholder="信仰"
                                >
                                    信仰
                                </InputItem>
                            </TouchableOpacity>
                            <View style={styles.DatePickerBox}>
                                <Text style={[styles.DatePickerText,{width: width * .2,}]}>出生日期</Text>
                                <DatePicker
                                    style={styles.dateStyle}
                                    date={this.state.datetime}
                                    customStyles = {{
                                        dateInput : {
                                            marginLeft : 22,
                                            borderColor: '#fff',
                                            lineHeight: 16,
                                            height: 22,
                                            fontSize: 100,
                                            transform: [{scale:1.08}]
                                        }
                                    }}
                                    mode="date"
                                    placeholder="选择"
                                    format="YYYY-MM-DD"
                                    confirmBtnText="确定"
                                    cancelBtnText="取消"
                                    showIcon={false}
                                    onDateChange={(date) => {this.setState({datetime: date})}}
                                />
                            </View>
                        </List>
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
    box: {
    },
    InputItemStyle: {
        fontSize: 16,
    },
    textInput: {
        padding: 0,
        textAlign: 'right',
        color: '#666',
        marginTop: -2,
        marginLeft: 32,
        fontSize: 16,
    },
    DatePickerBox: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    DatePickerText: {
        fontSize: 16,
        marginTop: 10,
        marginLeft: 15,
    },
    dateStyle: {
        width: 120,
        borderColor: '#fff',
        marginLeft: -22
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
