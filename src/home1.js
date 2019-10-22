import React, {Component} from 'react';
import {Image, Text, View, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, TextInput, DatePickerIOS} from 'react-native';
import {Actions} from "react-native-router-flux";
import {fetchRequest} from '../config/FetchUtils';
import {Button, InputItem, List, Toast, Provider} from '@ant-design/react-native';
import DeviceStorage from '../config/DeviceStorage';
import Pickers from '../config/Picker'
import DatePicker from 'react-native-datepicker'
import RefreshList from 'react-native-refreshlist'
export default class login extends Component {
    constructor(props) { // 初始化数据
        super(props);
        this.state = {
            movieList: [{name: '1'}],  // 电影列表的数据源
            startPage: 0,   // 从第几页开始加载
            pageSize: 10,   // 每页加载多少条数据
        }
    }
    login() {
        console.log()
        if (!this.state.name){
            Toast.offline('请填写昵称');
            this.inputRef.focus();
            return
        }
        let data = {
            name: this.state.name,
            sex: this.state.sex === '男'? 1: 2,
            belief: this.state.belief,
            birthday: this.state.datetime
        }
        console.log(data)
        return
    }
    _onPullRelease(resolve) {
        console.log(resolve)
        console.log('我是上拉刷新')
    }
    _loadMore(resolve) {
        console.log(resolve)
        console.log('我是上拉加载更多')
    }
    _renderItem = (item) => {
        return (
            <View>
                <Text>cehsihsh</Text>
                <Text>cehsihsh</Text>
                <Text>cehsihsh</Text>
                <Text>cehsihsh</Text>
            </View>
        )
    };
    _renderEmptyView = (item) => {
        return <View>暂无</View>
    };

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
                <RefreshList
                    ref={(ref) => {this.listView = ref}}
                    onPullRelease={(resolve)=> this._onPullRelease(resolve)}
                    ItemHeight={120}
                    data={this.state.movieList}
                    onEndReached={()=> this._loadMore()}
                    renderItem={(item)=> this._renderItem}
                    renderEmpty={(item)=> this._renderEmptyView}
                />
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
        width: 100,
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
