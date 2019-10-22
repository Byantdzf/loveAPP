import React, {Component} from 'react';
import {Image, Text, View, TouchableOpacity, Button} from 'react-native';
import {Actions} from "react-native-router-flux";
import {fetchRequest} from '../config/FetchUtils';
import {Toast, Provider} from '@ant-design/react-native';
import DeviceStorage from '../config/DeviceStorage';


export default class Bananas extends Component {
    get() {
        Toast.loading('正在检测登录状态', .6);

        DeviceStorage.get('token').then((res) => {
            console.log(res)
            if (res == null || res == '') {
                setTimeout(() => {
                    Actions.login()
                }, 800)
            } else {
                setTimeout(() => {
                    Actions.home()
                }, 800)
            }
        })
    }

    constructor(props) { // 初始化数据
        super(props);
        this.state = {
            text: 'React Native',
        }
    }

    componentWillMount() { // 即将要渲染虚拟DOM，在render函数前，只执行一次
        // console.log('componentWillMount...')
    }

    //已经加载虚拟DOM，在render之后，只执行一次，可在此完成异步网络请求或集成其他JavaScript库
    componentDidMount() {
        // console.log('componentDidMount...')
        setTimeout(()=>{
            this.get()
        },100)
    }

    render() {
        let pic = {
            uri: 'https://images.ufutx.com/201908/16/7d151aa8067ab044838add608e7395fd.jpeg'
        };
        return (
            <Provider>
                {/*<TouchableOpacity onPress={this.get()} style={{flex: 1}}>*/}
                    <View style={{flex: 1}}>
                        {/*<View>*/}
                        {/*<Text>{this.state.text}</Text>*/}
                        {/*</View>*/}
                        <Image source={pic} style={{flex: 1}}/>
                    </View>
                {/*</TouchableOpacity>*/}

            </Provider>
        );
    }
}
