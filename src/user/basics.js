import React, {Component} from 'react';
import {
    Image,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageBackground,
    TextInput,
    DatePickerIOS,
    ScrollView,
    StatusBar
} from 'react-native';
import {Actions} from "react-native-router-flux";
import {fetchRequest} from '../../config/FetchUtils';
import {Button, InputItem, List, Toast, Provider, Drawer} from '@ant-design/react-native';
import DeviceStorage from '../../config/DeviceStorage';
import Pickers from '../../config/Picker'
import DatePicker from 'react-native-datepicker'
import AsyncStorage from "@react-native-community/async-storage";
// import Basics from '../../src/user/basics'
import CommonAvatar from '../components/commonAvatar'

export default class userData extends Component {
    constructor(props) { // 初始化数据
        super(props);
        this.state = {
            name: '',
            sex: '男',
            belief: '其他',
            datetime: '1990-01-01',
            avatar: {uri: 'https://images.ufutx.com/201911/20/f936c7bcd8805d1f0db3743c5c157601.png'}
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
        let data = {
            photo: this.state.avatar.uri,
            name: this.state.name,
            sex: this.state.sex === '男'? '1': '2',
            belief: this.state.belief,
            birthday: this.state.datetime,
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
                let {name,profile_courtship, photo} = res.data
                console.log(res.data)
                if (profile_courtship) {
                    this.setState({
                        name: name,
                        sex: profile_courtship.sex == 1?'男':'女',
                        belief: profile_courtship.belief,
                        datetime: profile_courtship.birthday,
                        avatar: {uri: photo?photo:'https://images.ufutx.com/201911/20/f936c7bcd8805d1f0db3743c5c157601.png'}
                    });
                }
            }).catch(err => {
            console.log(`异常: ${err}`);
        })
    }

    componentWillMount() { // 即将要渲染虚拟DOM，在render函数前，只执行一次
    }

    //已经加载虚拟DOM，在render之后，只执行一次，可在此完成异步网络请求或集成其他JavaScript库
    componentDidMount() {
        // console.log('componentDidMount...')
        AsyncStorage.getItem('token', function (error, result) {
            console.log(error,result)
        })
        this.getUser()
    }
    getImagePath(image) { //获取上传图片
        // Toast.success('上传成功');
        console.log(image,'filePath')
        this.setState({
            avatar: {uri: image}
        })
    }

    renderAvatar() {
        let backPic = {uri: 'https://images.ufutx.com/201911/20/2f03aa6c5960592f7f28aa1c6cdb35c4.png'};
        return (
            <View>
                <Image source={backPic} style={styles.backPic}/>
                <View onTouchEnd={()=>{this.refs.app.openPicker()}}>
                    <Image source={this.state.avatar} style={styles.uploadIcon}/>
                </View>
                {/*<TouchableOpacity style={{zIndex: 1000}}  onPress={()=>{this.refs.app.openPicker()}} activeOpacity={1}>*/}
                {/*<Image source={uploadIcon} style={styles.uploadIcon}/>*/}
                {/*</TouchableOpacity>*/}
            </View>
        )
    }
    renderBasice() {
        let codeIcon = {uri: 'https://images.ufutx.com/201910/17/70c4a203145a1bbc535b0524a5133bee.png'};
        let dot = (<Text style={{color: '#d92553'}}>*</Text>)
        return (
            <View style={{backgroundColor: '#ffffff',}}>
                <View style={[styles.touchConainer, {width: width*.94 }]}>
                    <Text style={{color: '#666', padding: 12, paddingTop: 0}}>基本资料</Text>
                    <List style={styles.box}  >
                        <InputItem
                            clear
                            erro
                            textAlign='end'
                            style={[styles.InputItemStyle,{paddingRight: 22}]}
                            value={this.state.name}
                            ref={el => (this.inputRef = el)}
                            onChange={value => {
                                this.setState({
                                    name: value,
                                });
                            }}
                            // extra={<Image source={codeIcon} style={styles.icon}/>}
                            placeholder="昵称"
                        >
                            <Text>昵称 {dot}</Text>
                        </InputItem>
                        <TouchableOpacity onPress={() => {this.selectSex()}}>
                            <InputItem
                                textAlign='end'
                                value={this.state.sex}
                                style={styles.InputItemStyle}
                                editable={false}
                                placeholder="性别"
                                extra={<Image source={codeIcon} style={styles.icon}/>}
                            >
                                <Text>性别 {dot}</Text>
                            </InputItem>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {this.selectBelief()}}>
                            <InputItem
                                textAlign='end'
                                value={this.state.belief}
                                style={styles.InputItemStyle}
                                editable={false}
                                placeholder="信仰"
                                extra={<Image source={codeIcon} style={styles.icon}/>}
                            >
                                <Text>信仰 {dot}</Text>
                            </InputItem>
                        </TouchableOpacity>
                        <View style={styles.DatePickerBox}>
                            <Text style={[styles.DatePickerText,{width: width * .2,}]}>出生日期 {dot}</Text>
                            <View style={{flexDirection: 'row'}}>
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
                                        },
                                        dateText:{
                                            color: '#666',
                                        }
                                    }}
                                    mode="date"
                                    placeholder="选择"
                                    format="YYYY-MM-DD"
                                    confirmBtnText="确定"
                                    cancelBtnText="取消"
                                    iconComponent={<Image source={codeIcon} style={styles.icon}/>}
                                    showIcon={true}
                                    onDateChange={(date) => {this.setState({datetime: date})}}
                                />
                            </View>
                        </View>
                    </List>
                </View>
            </View>
        )
    }

    renderBtn() {
        return (
            <View>
                <View style={{height: 32}}></View>
                <TouchableOpacity onPress={() => {
                    this.login()
                }}>
                    <View style={styles.btnStyle}>
                        <Text style={styles.textStyle}>寻找心仪的TA</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (

            <View style={{backgroundColor: "#fff", height: height,}}>
                {/*<Basics></Basics>*/}
                <Provider>
                    <CommonAvatar ref='app'  getImagePath={this.getImagePath.bind(this)}></CommonAvatar>
                    <ScrollView
                        keyboardDismissMode="on-drag"
                        keyboardShouldPersistTaps='always'>
                        {/*状态栏*/}
                        <StatusBar translucent={false} backgroundColor='#cd274e' barStyle="light-content"/>
                        {/*头像*/}
                        {this.renderAvatar()}
                        {/*基本信息*/}
                        {this.renderBasice()}
                        {/*{this.renderBasice()}*/}
                        {this.renderBtn()}
                    </ScrollView>
                </Provider>
            </View>

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
        textAlign: 'right',
        color: '#666666'
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
        justifyContent: 'space-between'
    },
    DatePickerText: {
        fontSize: 16,
        marginTop: 10,
        marginLeft: 15,
    },
    dateStyle: {
        width: 120,
        borderColor: '#fff',
        marginRight: width*.038
    },

    backPic: {
        height: 180,
    },
    uploadIcon:{
        width: 86,
        height: 86,
        borderRadius: 50,
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        marginTop: -46,
        zIndex: 1000,
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
        width: 16,
        height: 16,
    }
});

// export default () => (
//     <Provider>
//         <login />
//     </Provider>
// );
