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
import {Button, InputItem, List, Toast, Provider, Drawer, Portal} from '@ant-design/react-native';
import DeviceStorage from '../../config/DeviceStorage';
import Pickers from '../../config/Picker'
import DatePicker from 'react-native-datepicker'
import AsyncStorage from "@react-native-community/async-storage";
// import Basics from '../../src/user/basics'
import CommonAvatar from '../components/commonAvatar'
import WX from '../../config/wxapi'
export default class vipList extends Component {
    constructor(props) { // 初始化数据
        super(props);
        this.state = {
            type: '黄金',
            rank: {},
            score: {},
            user: {},
            feature: [],
            explain: [],
            sub_ranks: [],
            abc: [{id: 'assasa'},{id:'assssssssss'}]
            // sex: '男',
            // belief: '其他',
            // datetime: '1990-01-01',
            // avatar: {uri: 'https://images.ufutx.com/201911/20/f936c7bcd8805d1f0db3743c5c157601.png'}
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

    getList() {
        let loading = Toast.loading('加载中...')
        fetchRequest(`official/app/ranks?name=${this.state.type}`, 'GET')
            .then(res => {
                let {rank, score, user} = res.data
                let {feature, explain, sub_ranks} = rank
                this.setState({
                    rank,
                    score,
                    user,
                    feature,
                    explain,
                    sub_ranks,
                });
                console.log(this.state.sub_ranks)
                if(this.state.type == '黄金'){
                    this.setState({
                        sub_ranks: this.state.sub_ranks.splice(1,2)
                    })
                }
                console.log(this.state.sub_ranks)
                console.log(this.state.rank)
                console.log(this.state.feature)
                Portal.remove(loading)
            }).catch(err => {
            console.log(`异常: ${err}`);
        })
    }

    componentWillMount() { // 即将要渲染虚拟DOM，在render函数前，只执行一次
    }

    //已经加载虚拟DOM，在render之后，只执行一次，可在此完成异步网络请求或集成其他JavaScript库
    componentDidMount() {
        this.getList()
    }

    TabBarFn(type) {
        this.setState({
            type: type
        });
        setTimeout(() => {
            this.getList()
        })
    }

    vipPay(id) {
        let loading = Toast.loading('支付中...')
        fetchRequest(`official/app/member/recharge?sub_rank_id=${id}`, 'POST')
            .then(res => {
                Portal.remove(loading)
                if (res.code != 0) {
                    return
                }
                let {wx_pay} = res.data
                WX.pay(wx_pay.config)
            }).catch(err => {
            console.log(`异常: ${err}`);
        })
    }

    renderTab() {
        return (
            <View>
                <View style={styles.mainTab}>
                    <Text style={this.state.type == '市级' ? styles.active : ''} onPress={() => {
                        this.TabBarFn('市级')
                    }}>市级VIP</Text>
                    <Text style={this.state.type == '黄金' ? styles.active : ''} onPress={() => {
                        this.TabBarFn('黄金')
                    }}>黄金VIP</Text>
                    <Text style={this.state.type == '钻石' ? styles.active : ''} onPress={() => {
                        this.TabBarFn('钻石')
                    }}>钻石VIP</Text>
                </View>
                <View style={styles.mainBox}>
                    {this.state.feature.map((item)=>{
                        console.log(item)
                        let icon = {uri: item.icon}
                        return (
                            <View key={item.text} style={{alignItems: 'center',marginRight: 6,marginLeft: 6, marginTop: 10,width: 86,}}>
                                <Image source={icon} style={{width: 30,height: 30,}}/>
                                <Text numberOfLines={1} style={{fontSize: 12,marginTop:8,}}>{item.text}</Text>
                            </View>
                        )
                    })}
                </View>
                <View style={styles.mainBox}>
                    <Text style={{color: '#333333'}}>说明：</Text>
                    {this.state.explain.map((item)=>{
                        console.log(item)
                        let icon = {uri: item.icon}
                        return (
                            <View key={item}>
                                <Text style={{color: '#666666', lineHeight: 28}}>{item}</Text>
                            </View>
                        )
                    })}
                </View>
                <View style={{height: 100}}></View>
            </View>

        )
    }

    renderBtn() {
        let sub_one = this.state.sub_ranks[0]
        let sub_two = this.state.sub_ranks[1]
        return (
            <View style={styles.mainBtn}>
                <View style={styles.btnStyle} onTouchEnd={()=>{this.vipPay(sub_one.id)}}>
                    <Text style={{color: '#fff'}}>￥{sub_one?sub_one.discount_price:''} / {sub_one?sub_one.name:''}</Text>
                </View>
                <View style={{width: 2, height: 32, backgroundColor: '#fff', marginTop: 8,}}></View>
                <View style={styles.btnStyle} onTouchEnd={()=>{this.vipPay(sub_two.id)}}>
                    <Text style={{color: '#fff'}}>￥{sub_two?sub_two.discount_price:''} / {sub_two?sub_two.name:''}</Text>
                </View>
            </View>
        )
    }

    render() {
        return (

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
                    {this.renderBtn()}
                </Provider>
            </View>

        );
    }
}
const {width, height, scale} = Dimensions.get('window');
const styles = StyleSheet.create({
    btnStyle: {
        width: 180,
        // backgroundColor: '#fff',
        color: '#666',
        // marginTop: 22,
        height: 52,
        lineHeight: 52,
        alignItems: 'center',
        paddingTop: 16
    },
    mainBtn: {
        width: width,
        height: 52,
        position: 'absolute',
        bottom: 16,
        left: 0,
        backgroundColor: '#D92553',
        flex: 1, flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    active: {
        color: '#d92553',
        fontSize: 18,
        fontWeight: 'bold',
        borderBottomWidth: 2,
        borderColor: '#d92553',
        paddingBottom: 4,
        textAlign: 'center'
    },
    mainBox: {
        // flex: 1,
        // flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        display:'flex',
        flexDirection: 'row',
        marginTop: 22,
        borderColor: '#d6d6d9',
        borderWidth: 1,
        borderRadius: 8,
        width: width*.9,
        alignSelf: 'center',
        padding: 12,
    },
    mainTab: {
        flex: 1, flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 22,
    },
});
