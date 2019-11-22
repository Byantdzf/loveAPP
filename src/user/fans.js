import React, {Component} from "react";

import {
    Image,
    FlatList,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    TextInput
} from "react-native";
import {fetchRequest} from '../../config/FetchUtils';
import {SearchBar, Toast, Provider, Drawer, SwipeAction} from "@ant-design/react-native";
import {Actions} from "react-native-router-flux";
import CommunalNavBar from '../components/communalNavBar';
import {BaseComponent} from '../../baseComponent/baseComponent'

let pageNo = 1;//当前第几页
let totalPage = 5;//总的页数

export default class fans extends Component {
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
            isLoading: true, //网络请求状态
            error: false,
            errorInfo: "",
            visible: false, // 抽屉开不开
            dataArray: [],
            loading: true,
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            isRefreshing: false,//下拉控制
        };
        this.fetchData = this.fetchData.bind(this);
        this.refreshData = () => {
            this.setState({//复原数据
                list: []
            })
            pageNo = 1
            this.fetchData(pageNo);
        }
    }

    componentDidMount() {
        pageNo = 1
        this.fetchData(pageNo);
    }

    fetchData(pageNo) {
        // Toast.loading('加载中...', .2);
        this.setState({
            loading: !this.state.loading
        });
        let URL = `official/app/followings?page=${pageNo}&keyword=${this.state.keyword}`
        fetchRequest(URL, 'GET')
            .then(res => {
                let foot = 0;
                if (pageNo >= totalPage) {
                    foot = 1; // listView底部显示没有更多数据了
                }
                this.setState({
                    //复制数据源
                    list: this.state.list.concat(res.data.data),
                    isLoading: false,
                    showFoot: foot,
                    isRefreshing: false,
                    showList: res.data.data.length > 0 ? true : false,
                });
                setTimeout(() => {
                    this.setState({
                        loading: !this.state.loading
                    });
                }, .4)
                console.log(this.state.list)
            }).catch(err => {
            console.log(`异常: ${err}`);
        })
    }

    onChange(value) {
        this.setState({keyword: value});
    }

    clear() {
        this.setState({value: ''});
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
    // 返回中间按钮
    renderTitleItem() {
        return (
            <TouchableOpacity>
                <TextInput
                    value={this.state.keyword}
                    style={styles.searchStyle}
                    onChangeText={text => this.onChange(text)}
                    placeholder="搜索好友..."
                    onBlur={value => {
                        this.onSubmit(value)
                    }}
                />
            </TouchableOpacity>
        );
    }

    renderData() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                    <View style={styles.containerv}>
                        <CommunalNavBar
                            titleItem={() => this.renderTitleItem()}
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
                    </Provider>
                    <StatusBar translucent={false} backgroundColor='#D92553' barStyle="light-content"/>
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
                    抱歉！没有加载出来...
                </Text>
            </View>
        );
    }

    renderLoadingView() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="small" color="#D92553"/>
                <Text style={{marginLeft: 12, color: '#666666'}}>加载中...</Text>
            </View>
        );
    }

    _renderFooter() {
        if (this.state.showFoot === 1) {
            return (
                <View style={{height: 40, alignItems: 'center', justifyContent: 'flex-start',}}>
                    <Text style={{color: '#999999', fontSize: 14, marginTop: 5, marginBottom: 5,}}>
                        没有更多数据了
                    </Text>
                </View>
            );
        } else if (this.state.showFoot === 2) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator/>
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else if (this.state.showFoot === 0) {
            return (
                <View style={styles.footer}>
                    <Text></Text>
                </View>
            );
        }
    }

    _separator() {
        return <View style={{height: 1, width:width*.8, backgroundColor: '#f6f6f6', alignSelf: 'flex-end'}}/>;
    }

    _onEndReached() {
        //如果是正在加载中或没有更多数据了，则返回
        if (this.state.showFoot != 0) {
            return;
        }
        //如果当前页大于或等于总页数，那就是到最后一页了，返回
        if ((pageNo != 1) && (pageNo >= totalPage)) {
            return;
        } else {
            pageNo++;
        }
        //底部显示正在加载更多数据
        this.setState({showFoot: 2});
        //获取数据
        this.fetchData(pageNo);
    }

    _deleteUser(id) {
        fetchRequest(`official/app/home?`, 'DELETE')
            .then(res => {
                console.log('删除成功')
            }).catch(err => {
            console.log(`异常: ${err}`);
        })
    }

    renderMovie({item}) {
        // { item }是一种“解构”写法，请阅读ES2015语法的相关文档
        // item也是FlatList中固定的参数名，请阅读FlatList的相关文档
        let id = item.id
        let man = {uri: 'https://images.ufutx.com/201910/21/a92b5d29dedb9932568f97fcdff865bc.png'};
        let woman = {uri: 'https://images.ufutx.com/201910/21/40b26d71cf2af9b1be0f874605c6ef2f.png'};
        let iconText = ''
        if (item.profile_courtship) {
            iconText = item.profile_courtship.sex == 1 ?
                <Image source={man} style={styles.iconStyle}/> :
                <Image source={woman} style={styles.iconStyle}/>;
        } else {
            iconText = <Image source={man} style={styles.iconStyle}/>
        }
        const right = [
            {
                text: '查看好友',
                onPress: () => Actions.userDetail({id, id}),
                style: { backgroundColor: 'orange', color: 'white' },
            },
            {
                text: '删除好友',
                onPress: () => this._deleteUser(id),
                style: { backgroundColor: 'red', color: 'white' },
            },
        ];
        return (
            <TouchableOpacity onPress={() => {
                Actions.userDetail({id, id})
            }}>
                <SwipeAction
                    autoClose
                    style={{ backgroundColor: 'transparent' }}
                    right={right}
                    onOpen={() => console.log('open')}
                    onClose={() => console.log('close')}
                >
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                    }}>
                        <View style={{padding: 12}}>
                            <Image
                                source={{uri: item.photo}}
                                style={[styles.listPhoto]}
                            />
                        </View>
                        <View style={{
                            paddingTop: 18,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            flex: 1,
                            paddingRight: 18
                        }}>
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "flex-start",
                            }}>
                                <Text style={{marginLeft: 4,}}>{item.name}</Text>
                                {iconText}
                            </View>
                            <View><Text style={{color: '#666'}}>9月19号</Text></View>
                        </View>
                    </View>
                    <View style={[styles.containerText]}>
                        <Text style={{marginLeft: 8, color: '#97979f', fontSize: 12}}>
                            {item.age} {item.profile_courtship?item.profile_courtship.stature + 'cm':'未获取'} {item.industry}/{item.industry_sub} {item.profile_courtship?item.profile_courtship.city:'未获取'}
                        </Text>
                    </View>
                </SwipeAction>
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
        shadowOffset: {width: 0, height: 0},
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
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
        marginLeft: 68,
        marginTop: -32,
        marginBottom: 16
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
    footer: {
        flexDirection: 'row',
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
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
        width: 32,
        height: 32,
        marginLeft: 10,
        // borderRadius: 50,
        // borderColor: '#fff',
        // borderWidth: 1,
    },
    navbarTitleItemStyle: {
        width: 66,
        height: 20,
    },
    navbarRightItemStyle: {
        width: 24,
        height: 24,
        marginRight: 15,
    },
    searchStyle: {
        height: 30,
        width: width*.92,
        borderColor: '#fff', borderWidth: 1,
        borderRadius: 22,
        paddingRight: 12,
        paddingLeft: 12,
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: '#fff',
        color: '#666'
    },
    sidebarTOP: {
        height: height*0.3,
        backgroundColor: '#D92553',
    },
    sidebarBack: {
        width: 24,
        height: 24,
        margin: 22,
        marginBottom: 2
    },
    sidebarPic:{
        width: 60,
        height: 60,
        borderColor: "#fff",
        borderWidth: 1,
        borderRadius: 50,
        margin: 22,
        marginTop: 2,
        marginRight: 12,
    },
    sidebarUser: {
        flexDirection: 'column',
        marginTop: 8,
    },
    UserInfoEdit:{
        color: '#fff',
        borderWidth: 1,
        borderColor: '#fff',
        fontSize: 12,
        marginTop: 8,
        textAlign: 'center',
        borderRadius: 12,
        paddingLeft: 6,
        paddingRight: 6,
        paddingTop: 2,
        paddingBottom: 1,
    },
    UserTitle: {
        color: '#fff',
        borderBottomWidth: 1,
        borderColor: '#fff',
        fontSize: 12,
        textAlign: 'center',
        paddingBottom: 2,
        marginTop: 2,
        paddingLeft: 4,
        paddingRight: 4,
    },
    UserNum: {
        color: '#fff',
        padding: 0,
        borderWidth: 0,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 22,
    },
    sidebarList: {
        height: 38,
        marginRight: 12,
        marginLeft: 12,
        marginTop: 18,
        borderBottomWidth: 1,
        borderColor: '#f0f0f0',
        // backgroundColor: 'pink'
    },
    sidebarBox: {
        flexDirection: 'row',
        flex: 1,
        // marginTop: 6,
        marginLeft: 4,
    },
    ItemIconStyle: {
        width: 28,
        height: 28,
        marginRight: 8,
    },
    ItemTextStyle: {
        fontSize: 16,
        marginLeft: 6,
        marginTop: 4,
    },
    listPhoto:{
        width: 50,
        height: 50,
        borderRadius: 50,
        borderColor: '#fff',
        borderWidth: 1,
    }
});
