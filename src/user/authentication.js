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
    StatusBar, SafeAreaView
} from 'react-native';
import {Actions} from "react-native-router-flux";
import {fetchRequest} from '../../config/FetchUtils';
import {Button, InputItem, List, Toast, Provider, Drawer, Portal} from '@ant-design/react-native';
import DeviceStorage from '../../config/DeviceStorage';
import Pickers from '../../config/Picker'
import DatePicker from 'react-native-datepicker'
import AsyncStorage from "@react-native-community/async-storage";
// import Basics from '../../src/user/basics'
import CommonAvatar from '../components/commonAvatar'
export default class authentication extends Component {
    constructor(props) { // 初始化数据
        super(props);
        this.state = {
            user: {},
            name: '',
            card_num: '',
            is_approved: 0,
            // sex: '男',
            // belief: '其他',
            // datetime: '1990-01-01',
            // avatar: {uri: 'https://images.ufutx.com/201911/20/f936c7bcd8805d1f0db3743c5c157601.png'}
        }
    }

    approveFn() {
        if (!this.state.name){
            Toast.offline('请先填写真实姓名');
            return
        }
        if (!this.state.card_num){
            Toast.offline('请先填写身份证号码');
            return
        }
        let data = {
            name: this.state.name,
            card_num: this.state.card_num,
        }
        console.log(data)
        Toast.loading('认证中...', .8);
        fetchRequest('official/app/user/approve', 'POST', data)
            .then(res => {
                console.log(res)
                if (res.code == 0) {
                    Toast.success('认证成功');
                    this.getUser()
                } else {
                    Toast.info('请重试');
                }
            }).catch(err => {
            console.log(`异常: ${err}`);
        })
    }

    getUser() {
        let loading = Toast.loading('加载中...')
        fetchRequest(`official/app/user`, 'GET')
            .then(res => {
                let {is_approved, card_num,name} = res.data
                this.setState({
                    user: res.data,
                    is_approved: is_approved,
                    name: name,
                    card_num: card_num
                })

                console.log(this.state.user)
                Portal.remove(loading)
            }).catch(err => {
            console.log(`异常: ${err}`);
        })
    }

    componentWillMount() { // 即将要渲染虚拟DOM，在render函数前，只执行一次
    }

    //已经加载虚拟DOM，在render之后，只执行一次，可在此完成异步网络请求或集成其他JavaScript库
    componentDidMount() {
        this.getUser()
    }

    TabBarFn(type) {
        this.setState({
            type: type
        });
        setTimeout(() => {
            this.getList()
        })
    }
    renderBtn(){
        let {is_approved} = this.state
        if (is_approved == 0){
            return(
                <View style={styles.btnStyle} onTouchEnd={()=>{this.approveFn()}}>
                    <Text style={{color: '#fff'}}>身份认证</Text>
                </View>
            )
        }else{
            return(
                <Text style={{paddingTop: 12,alignSelf: 'center',color: '#d92553',fontSize: 16,fontWeight: 'bold'}}>已认证</Text>
            )
        }
    }
    renderTab() {
        let {is_approved} = this.state
        return (
            <View>
                <Image resizeMode='contain' source={{uri: 'https://images.ufutx.com/201912/05/0e4615339fceb897b3163933aa87ea2f.png'}} style={styles.backPic}/>
                <View style={styles.mainBox}>
                    <Text style={is_approved == 1 ? styles.titleStyleA: styles.titleStyle}>{is_approved == 1 ? '已经实名认证了哦！' : '你还未实名认证！'}</Text>
                    <TextInput
                        style={styles.inputStyle}
                        onChangeText={value => {
                            this.setState({
                                name: value,
                            });
                        }}
                        editable={is_approved == 1 ? false : true}
                        value={this.state.name}
                        placeholder="真实姓名"
                    />
                    <TextInput
                        style={styles.inputStyle}
                        onChangeText={value => {
                            this.setState({
                                card_num: value,
                            });
                        }}
                        editable={is_approved == 1 ? false : true}
                        value={this.state.card_num}
                        placeholder="身份证号"
                    />
                    {this.renderBtn()}
                </View>
                <View style={{height: 100}}></View>
            </View>

        )
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#d92553'}}>
                <View style={{backgroundColor: "#fff", height: height,}}>
                    {/*<Basics></Basics>*/}
                    <Provider>
                        <ScrollView
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersistTaps='always'>
                            {/*状态栏*/}
                            <StatusBar translucent={false} backgroundColor='#cd274e' barStyle="light-content"/>
                            {this.renderTab()}
                        </ScrollView>
                    </Provider>
                </View>
            </SafeAreaView>
        );
    }
}
const {width, height, scale} = Dimensions.get('window');
const styles = StyleSheet.create({
    btnStyle: {
        width: 120,
        backgroundColor: '#d92553',
        color: '#666',
        marginTop: 22,
        alignItems: 'center',
        padding: 8,
        alignSelf: 'center'
    },
    mainBox: {
        // justifyContent: 'space-between',
        // flexWrap: 'wrap',
        // display:'flex',
        // flexDirection: 'row',
        marginTop: 22,
        borderColor: '#d6d6d9',
        borderWidth: 1,
        borderRadius: 6,
        width: width*.9,
        alignSelf: 'center',
        padding: 22,
    },
    mainTab: {
        flex: 1, flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 22,
    },
    backPic: {
        width: width,
        height: width*0.35,
    },
    box: {
        width: width* 0.82,
        alignSelf: 'center',
        borderTopWidth: 0,
        marginTop: 12,
    },
    titleStyle: {
        color: '#d92553',
        fontSize: 16,
        fontWeight: 'bold'
    },
    titleStyleA: {
        color: '#3c8933',
        fontSize: 16,
        fontWeight: 'bold'
    },
    inputStyle: {
        height: 40,
        borderColor: '#e1e1e1',
        borderBottomWidth: 1,
        marginTop: 12,
        fontSize: 14,
    }
});
