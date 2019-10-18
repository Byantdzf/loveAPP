import React, {Component} from 'react';
import {Image, Text, View, TouchableOpacity, Button} from 'react-native';
import {Actions} from "react-native-router-flux";
import {fetchRequest} from '../config/FetchUtils';

export default class Bananas extends Component {
    get() {
        fetchRequest('movies.json', 'GET')
            .then(res => {
                console.log(res, '数据')
                console.log('成功');
                this.setState({
                    text: res.title
                });
            }).catch(err => {
            console.log('异常');
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
    }

    render() {
        let pic = {
            uri: 'https://images.ufutx.com/201908/16/7d151aa8067ab044838add608e7395fd.jpeg'
        };
        return (
            <View style={{flex: 1}}>
                <TouchableOpacity onPress={() => {this.get()}}>
                    <View>
                        <Text>{this.state.text}</Text>
                    </View>
                </TouchableOpacity>
                <Image source={pic} style={{flex: 1}}/>
            </View>
        );
    }
}
