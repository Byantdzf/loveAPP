// 没有用到

import React, { Component } from "react";

import {Image, FlatList, StyleSheet, Text, View, Dimensions, TouchableOpacity, ActivityIndicator, SafeAreaView, StatusBar, TextInput } from "react-native";
import {fetchRequest} from '../../config/FetchUtils';
import {SearchBar, Toast, Provider, Drawer} from "@ant-design/react-native";
import {Actions} from "react-native-router-flux";
import CommunalNavBar from './communalNavBar';

export default class commonHomeNavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }
    onSubmit(value) {
        Toast.loading('搜索中...', .6);
        this.setState({
            list: [],
        });
        pageNo = 1
        setTimeout(() => {
            this.fetchData(pageNo);
        })
        console.log(value)
    }
    // 返回左边按钮
    renderLeftItem() {
        // 将组件返回出去
        return(
            <TouchableOpacity onPress={() => this.drawer && this.drawer.openDrawer()}>
                <Image source={{uri:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3699703635,816718470&fm=26&gp=0.jpg'}} style={styles.navbarLeftItemStyle} />
            </TouchableOpacity>
        );
    }

    // 返回中间按钮
    renderTitleItem() {
        return(
            <TouchableOpacity>
                {/*<Image source={{uri:'https://images.ufutx.com/201910/29/69c850040d52f8182741f5aaed7f155e.png'}} style={styles.navbarTitleItemStyle} />*/}
                {/*<Text style={{color: '#fff'}}>首页</Text>*/}
                <TextInput
                    value={this.state.keyword}
                    style={styles.searchStyle}
                    onChangeText={text => this.onChange(text)}
                    placeholder="搜索TA..."
                    onBlur={value => {
                        this.onSubmit(value)
                    }}
                />
            </TouchableOpacity>
        );
    }

    // 返回右边按钮
    renderRightItem() {
        return(
            <TouchableOpacity>
                <Image source={{uri:'https://images.ufutx.com/201911/11/33a46981f02bf62c9c47bcfd2d9d9ec2.png'}} style={styles.navbarRightItemStyle} />
            </TouchableOpacity>
        );
    }

    renderData() {
        let loading = this.state.loading ? <Image source={{uri: 'https://images.ufutx.com/201910/29/69c850040d52f8182741f5aaed7f155e.png'}} style={styles.refreshIcon}/>
            : <ActivityIndicator size="large" color="#D92553" />;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                <Drawer
                    sidebar={this.sidebar()}
                    position="left"
                    open={false}
                    drawerRef={el => (this.drawer = el)}
                    onOpenChange={this.onOpenChange}
                    drawerBackgroundColor="#ccc"
                    open={this.state.visible}
                    drawerWidth={width}
                >
                    <View style={styles.containerv}>
                        <CommunalNavBar
                            leftItem = {() => this.renderLeftItem()}
                            titleItem = {() => this.renderTitleItem()}
                            rightItem = {() => this.renderRightItem()}
                        />
                    </View>
                    <Provider>
                        <FlatList
                            data={this.state.list}
                            renderItem={this.renderMovie}
                            style={styles.list}
                            keyExtractor={(item, index) => index.toString()}
                            ListFooterComponent={this._renderFooter.bind(this)}
                            onEndReached={this._onEndReached.bind(this)}
                            onEndReachedThreshold={1}
                            ItemSeparatorComponent={this._separator}
                        />
                        <View style={{padding: 12,backgroundColor: '#fff'}}></View>
                        {/*<TouchableOpacity onPress={() => {this.fetchData()}} style={{ zIndex: 999999}}>*/}
                        <View style={styles.refresh} onTouchEnd={this.refreshData}>
                            <View style={styles.refreshLoad}>
                                {loading}
                            </View>
                        </View>
                        {/*</TouchableOpacity>*/}
                    </Provider>
                    <StatusBar translucent={false} backgroundColor='#d92553' barStyle="light-content" />
                </Drawer>
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

    sidebar() {
        return(
            <View>
                <Text>测试</Text>
            </View>
        )
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
                        <View style={{flexDirection: "row", justifyContent: "flex-start",alignItems: 'center', flex: 1,}}>
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
    refresh: {
        // backgroundColor: 'pink',
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        bottom: 42,
        right: 22,
    },
    refreshLoad: {
        width: 50,
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 50,
        shadowColor: '#D92553',
        shadowOffset: {width: 0,height: 0},
        shadowOpacity: 22,
        shadowRadius: 22,
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    refreshIcon: {
        width: 32,
        height: 32,
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
    },
    containerv: {
        // flex: 1,
        // alignItems: 'center',
        // backgroundColor: '#D92553',
    },
    navbarLeftItemStyle: {
        width:32,
        height:32,
        marginLeft:15,
        borderRadius: 50
    },
    navbarTitleItemStyle: {
        width:66,
        height:20,
    },
    navbarRightItemStyle: {
        width:24,
        height:24,
        marginRight:15,
    },
    searchStyle: {
        height: 30,
        width: 300,
        borderColor: '#fff', borderWidth: 1,
        borderRadius: 22,
        paddingRight: 12,
        paddingLeft: 12,
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: '#fff',
        color: '#666'
    }
});
