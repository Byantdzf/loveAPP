
import React, { Component } from "react";

import {Image, FlatList, StyleSheet, Text, View, Dimensions, TouchableOpacity, ActivityIndicator, SafeAreaView} from "react-native";
import {fetchRequest} from '../config/FetchUtils';
import {SearchBar, Toast, Provider} from "@ant-design/react-native";
import {Actions} from "react-native-router-flux";

let pageNo = 1;//当前第几页
let totalPage=5;//总的页数
let itemNo=0;//item的个数
export default class SampleAppMovies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            list: [],
            page: 1,
            keyword: '',
            showList: true,
            loaded: false,
            showPage: false,
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            dataArray: [],
            showFoot:0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing:false,//下拉控制
        };
        // 在ES6中，如果在自定义的函数里使用了this关键字，则需要对其进行“绑定”操作，否则this的指向会变为空
        // 像下面这行代码一样，在constructor中使用bind是其中一种做法（还有一些其他做法，如使用箭头函数等）
        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        pageNo = 1
        this.fetchData(pageNo);
    }

    fetchData(pageNo) {
        Toast.loading('加载中...', .6);
        fetchRequest(`official/app/home?page=` + pageNo + `&keyword=` + this.state.keyword, 'GET')
            .then(res => {
                let foot = 0;
                if (pageNo >= totalPage) {
                    foot = 1;//listView底部显示没有更多数据了
                }
                this.setState({
                    //复制数据源
                    list: this.state.list.concat(res.data.data),
                    isLoading: false,
                    showFoot: foot,
                    isRefreshing: false,
                    showList: res.data.data.length > 0 ? true : false,
                });
                // this.setState({
                //     list: this.state.list.concat(res.data.data),
                //     loaded: true,

                //     page: this.state.page+1
                // });
                console.log(this.state.list)
            }).catch(err => {
            console.log(`异常: ${err}`);
        })
    }

    onChange(value) {
        // console.log(value)
        this.setState({keyword: value});
    }

    clear() {
        this.setState({value: ''});
    }

    onSubmit(value) {
        Toast.loading('搜索中...', .6);
        this.setState({
            list: []
        });
        pageNo = 1
        setTimeout(() => {
            this.fetchData(pageNo);
        })
        console.log(value)
    }
    renderData() {
        // if (!this.state.showList) {
        //     return this.renderNoList();
        // }

        // if (!this.state.loaded) {
        //     return this.renderLoadingView();
        // }
        // let showPage = this.state.showPage ?
        //     <View style={[styles.dotStyle, {width: width}]}>
        //         <Text>加载更多</Text>
        //     </View>
        //     : null;

        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                <Provider>
                    <SearchBar
                        // defaultValue="初始值"
                        placeholder="搜索"
                        value={this.state.keyword}
                        onSubmit={value => {
                            this.onSubmit(value)
                        }}
                        onCancel={() => {
                            this.clear()
                        }}
                        onChange={value => {
                            this.onChange(value)
                        }}

                    />
                    <FlatList
                        data={this.state.list}
                        renderItem={this.renderMovie}
                        style={styles.list}
                        keyExtractor={item => item.id}
                        ListFooterComponent={this._renderFooter.bind(this)}
                        onEndReached={this._onEndReached.bind(this)}
                        onEndReachedThreshold={1}
                        ItemSeparatorComponent={this._separator}
                        // getItemLayout={(data, index) => ( {length: 44, offset: (44 + 1) * index, index} )}
                        // //决定当距离内容最底部还有多远时触发onEndReached回调。
                        // //注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                        // onEndReachedThreshold={0.1}
                        // //当列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用
                        // onEndReached={({distanceFromEnd}) => (
                        //     // console.log('dasd   onEndReached')
                        //     setTimeout(() => {
                        //         this.setState({
                        //             showPage: true,
                        //         });
                        //     })
                        // )}
                    />
                    <View style={{padding: 12,backgroundColor: '#fff'}}></View>
                </Provider>
            </SafeAreaView>
        );
    }

    render() {
        //第一次加载等待的view
        if (this.state.isLoading && !this.state.error) {
            return this.renderLoadingView();
        } else if (this.state.error) {
            //请求失败view
            return this.renderErrorView();
        }
        //加载数据
        return this.renderData();
    }
    //加载失败view
    renderErrorView() {
        return (
            <View style={styles.container}>
                <Text>
                    Fail
                </Text>
            </View>
        );
    }

    renderLoadingView() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="small" color="#D92553" />
                <Text style={{marginLeft: 12, color: '#666666'}}>加载中...</Text>
            </View>
        );
    }
    _renderFooter(){
        if (this.state.showFoot === 1) {
            return (
                <View style={{height:30,alignItems:'center',justifyContent:'flex-start',}}>
                    <Text style={{color:'#999999',fontSize:14,marginTop:5,marginBottom:5,}}>
                        没有更多数据了
                    </Text>
                </View>
            );
        } else if(this.state.showFoot === 2) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator />
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else if(this.state.showFoot === 0){
            return (
                <View style={styles.footer}>
                    <Text></Text>
                </View>
            );
        }
    }
    renderNoList() {
        return (
            <Provider>
                <SearchBar
                    // defaultValue="初始值"
                    placeholder="搜索"
                    value={this.state.keyword}
                    onSubmit={value => {
                        this.onSubmit(value)
                    }}
                    onCancel={() => {
                        this.clear()
                    }}
                    onChange={value => {
                        this.onChange(value)
                    }}

                />
                <View style={styles.container}>
                    <Text>暂无匹配数据...</Text>
                </View>
            </Provider>
        );
    }
    _separator(){
        return <View style={{height:1,backgroundColor:'#999999'}}/>;
    }
    _onEndReached(){
        //如果是正在加载中或没有更多数据了，则返回
        if(this.state.showFoot != 0 ){
            return ;
        }
        //如果当前页大于或等于总页数，那就是到最后一页了，返回
        if((pageNo!=1) && (pageNo>=totalPage)){
            return;
        } else {
            pageNo++;
        }
        //底部显示正在加载更多数据
        this.setState({showFoot:2});
        //获取数据
        this.fetchData( pageNo );
    }

    renderMovie({ item }) {
        // { item }是一种“解构”写法，请阅读ES2015语法的相关文档
        // item也是FlatList中固定的参数名，请阅读FlatList的相关文档
        let id = item.id
        let man = {uri: 'https://images.ufutx.com/201910/21/a92b5d29dedb9932568f97fcdff865bc.png'};
        let woman = {uri: 'https://images.ufutx.com/201910/21/40b26d71cf2af9b1be0f874605c6ef2f.png'};
        let iconText = item.profile_courtship.sex == 1 ?
            <Image source={man} style={styles.iconStyle}/> :
            <Image source={woman} style={styles.iconStyle}/>;

        return (
            <TouchableOpacity onPress={() => {Actions.userDetail({id, id})}}>
                <View>
                    <View style={styles.container}>
                        <Image
                            source={{ uri: item.photo }}
                            style={[{width: width*.92, height: width*.9}]}
                        />
                    </View>
                    <View style={styles.containerText}>
                        <View style={{flexDirection: "row", justifyContent: "flex-start",}}>
                            <Text style={{marginLeft: 8,}}>{item.name}</Text>
                            {iconText}
                        </View>
                        <Text style={{marginRight: 4,color: '#97979f',fontSize: 12}}>{item.profile_courtship.province}   {item.profile_courtship.city}</Text>
                    </View>
                    <View style={[styles.containerText,{marginTop: -8}]}>
                        <Text style={{marginLeft: 8,color: '#97979f',fontSize: 12}}>
                            {item.age} {item.profile_courtship.stature+'cm'} {item.industry}/{item.industry_sub}
                        </Text>
                    </View>
                    {/*<View style={[styles.dotStyle,{width: width}]}></View>*/}
                </View>
            </TouchableOpacity>
        );
    }
}
const {width, height, scale} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        margin: 12,
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "pink"
    },
    containerText: {
        margin: 12,
        marginTop: 0,
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        // backgroundColor: "#dedede"
    },
    iconStyle: {
        width: 14, height: 14, marginTop: 2, marginLeft: 2,
    },
    dotStyle: {
        height: 4,
        backgroundColor: '#f6f6f6'
    },
    list: {
        backgroundColor: "#fff",
        borderColor: '#fff'
    },
    title: {
        fontSize: 15,
        color: 'blue',
    },
    footer:{
        flexDirection:'row',
        height:24,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:10,
    },
    content: {
        fontSize: 15,
        color: 'black',
    }
});
