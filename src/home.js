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
import {fetchRequest} from '../config/FetchUtils';
import {SearchBar, Toast, Provider, Drawer, Portal} from "@ant-design/react-native";
import {Actions} from "react-native-router-flux";
import CommunalNavBar from './components/communalNavBar';
import authentication from "./user/authentication";
import upgradeVIP from "./upgrade/vipList";
import setting from "./user/setting";
import friends from "./user/friends";

let pageNo = 1;//当前第几页
let totalPage = 5;//总的页数

export default class SampleAppMovies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            list: [],
            page: 1,
            user: {},
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
            avatar: {uri: 'https://images.ufutx.com/201911/20/f936c7bcd8805d1f0db3743c5c157601.png'}

        };
        // 在ES6中，如果在自定义的函数里使用了this关键字，则需要对其进行“绑定”操作，否则this的指向会变为空
        // 像下面这行代码一样，在constructor中使用bind是其中一种做法（还有一些其他做法，如使用箭头函数等）
        this.fetchData = this.fetchData.bind(this);
        this.refreshData = () => {
            this.setState({//复原数据
                list: []
            })
            pageNo = 1
            this.fetchData(pageNo);
        }
        this.onOpenChange = isOpen => {
            /* tslint:disable: no-console */
            console.log('是否打开了 Drawer', isOpen.toString());
        };
    }

    componentDidMount() {
        pageNo = 1
        this.fetchData(pageNo);
        this.getUser()
    }
    getUser() {
        let loading = Toast.loading('加载中...')
        fetchRequest(`official/app/user`, 'GET')
            .then(res => {
                let {is_approved, card_num,name,photo} = res.data
                this.setState({
                    user: res.data,
                    avatar: {uri: photo?photo:'https://images.ufutx.com/201912/05/3b5bf7522fe585342d56d44eebeb3412.jpeg'}
                })
                console.log(this.state.user)
                Portal.remove(loading)
            }).catch(err => {
            console.log(`异常: ${err}`);
        })
    }

    fetchData(pageNo) {
        Toast.loading('加载中...', .4);
        this.setState({
            loading: !this.state.loading
        });
        fetchRequest(`official/app/home?page=` + pageNo + `&keyword=` + this.state.keyword, 'GET')
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

    // 返回左边按钮
    renderLeftItem() {
        let {photo} = this.state.user?this.state.user:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3699703635,816718470&fm=26&gp=0.jpg'
        console.log(photo)
        return (
            <TouchableOpacity onPress={() => this.drawer && this.drawer.openDrawer()}>
                <Image
                    source={this.state.avatar}
                    style={styles.navbarLeftItemStyle}/>
            </TouchableOpacity>
        );
    }

    // 返回中间按钮
    renderTitleItem() {
        return (
            <TouchableOpacity>
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
        return (
            <TouchableOpacity>
                <Image source={{uri: 'https://images.ufutx.com/201911/11/33a46981f02bf62c9c47bcfd2d9d9ec2.png'}}
                       style={styles.navbarRightItemStyle}/>
            </TouchableOpacity>
        );
    }

    renderData() {
        let loading = this.state.loading ?
            <Image source={{uri: 'https://images.ufutx.com/201910/29/69c850040d52f8182741f5aaed7f155e.png'}}
                   style={styles.refreshIcon}/>
            : <ActivityIndicator size="large" color="#D92553"/>;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: '#d92553'}}>
                <Drawer
                    sidebar={this.sidebar()}
                    position="left"
                    open={false}
                    drawerRef={el => (this.drawer = el)}
                    onOpenChange={this.onOpenChange}
                    drawerBackgroundColor="#fff"
                    open={this.state.visible}
                    drawerWidth={width}
                >
                    <View style={styles.containerv}>
                        <CommunalNavBar
                            leftItem={() => this.renderLeftItem()}
                            titleItem={() => this.renderTitleItem()}
                            rightItem={() => this.renderRightItem()}
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
                        <View style={{padding: 12, backgroundColor: '#fff'}}></View>
                        {/*<TouchableOpacity onPress={() => {this.fetchData()}} style={{ zIndex: 999999}}>*/}
                        <View style={styles.refresh} onTouchEnd={this.refreshData}>
                            <View style={styles.refreshLoad}>
                                {loading}
                            </View>
                        </View>
                        {/*</TouchableOpacity>*/}
                    </Provider>
                    <StatusBar  translucent={false} backgroundColor='#D92553' barStyle="light-content"/>
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
        return (
            <View>
                <View style={styles.sidebarTOP}>
                    <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'flex-end'}}
                                      onPress={() => this.drawer && this.drawer.closeDrawer()}
                    >
                        <Image source={{uri: 'https://images.ufutx.com/201911/11/ef443905239d29665d4976264d51bbab.png'}}
                               style={styles.sidebarBack}/>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row'}} onTouchEnd={()=>{Actions.userData()}}>
                        <Image source={this.state.avatar}
                               style={styles.sidebarPic}/>
                               <View style={styles.sidebarUser}>
                                   <Text style={{color: '#fff'}}>{this.state.user.name}</Text>
                                   <Text style={styles.UserInfoEdit}>编辑资料</Text>
                               </View>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginRight: 42,marginLeft: 42,}}>
                        <View style={styles.sidebarUser} onTouchEnd={()=>{Actions.friends()}}>
                            {/*<Image source={{uri: 'https://images.ufutx.com/201911/11/62a1dea40e7269c5610517107f628a44.png'}}*/}
                                   {/*style={styles.sidebarBack}/>*/}
                            <Text style={[styles.UserNum]}>{this.state.user.friend_count}</Text>
                            <Text style={styles.UserTitle}>我的好友</Text>
                        </View>
                        <View style={styles.sidebarUser} onTouchEnd={()=>{Actions.fans()}}>
                            {/*<Image source={{uri: 'https://images.ufutx.com/201911/11/62a1dea40e7269c5610517107f628a44.png'}}*/}
                            {/*style={styles.sidebarBack}/>*/}
                            <Text style={[styles.UserNum]}>{this.state.user.follow_count}</Text>
                            <Text style={styles.UserTitle}>我的关注</Text>
                        </View>
                        <View style={styles.sidebarUser} onTouchEnd={()=>{Actions.fans()}}>
                            {/*<Image source={{uri: 'https://images.ufutx.com/201911/11/62a1dea40e7269c5610517107f628a44.png'}}*/}
                            {/*style={styles.sidebarBack}/>*/}
                            <Text style={[styles.UserNum]}>{this.state.user.fans_count}</Text>
                            <Text style={styles.UserTitle}>关注我的</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.sidebarList} onTouchEnd={() => {
                    Actions.authentication()
                }}>
                    <View style={styles.sidebarBox}>
                        <Image source={{uri: 'https://images.ufutx.com/201912/02/0fc93b5d42ed996d040e01b8e6f5424b.png'}}
                               style={styles.ItemIconStyle}/>
                        <Text style={styles.ItemTextStyle}>实名认证</Text>
                        {this.state.user.is_approved == 1 ? <Text style={[styles.ItemRightStyle,{color: '#d92553'}]}>已认证</Text> : <Text style={styles.ItemRightStyle}>未认证</Text>}
                    </View>
                </View>
                <View style={styles.sidebarList} onTouchEnd={() => {
                    Actions.upgradeVIP()
                }}>
                    <View style={styles.sidebarBox}>
                        <Image source={{uri: 'https://images.ufutx.com/201912/02/1cc2eb8c9023ef17751d366410e11e16.png'}}
                               style={styles.ItemIconStyle}/>
                        <Text style={styles.ItemTextStyle}>购买会员</Text>
                    </View>
                </View>
                <View style={styles.sidebarList} onTouchEnd={()=>{Actions.setting()}}>
                    <View  style={styles.sidebarBox}>
                        <Image source={{uri: 'https://images.ufutx.com/201912/02/5d645fddb4a5f61bd8b05fc496bf51bd.png'}}
                               style={styles.ItemIconStyle}/>
                        <Text style={styles.ItemTextStyle}>设置</Text>
                    </View>
                </View>
            </View>
        )
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
                <View style={{height: 30, alignItems: 'center', justifyContent: 'flex-start',}}>
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
        return <View style={{height: 6, backgroundColor: '#f5f6f9'}}/>;
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

        return (
            <TouchableOpacity onPress={() => {
                Actions.userDetail({id, id})
            }}>
                <View>
                    <View style={styles.container}>
                        <Image
                            source={{uri: item.photo}}
                            style={[{width: width * .92, height: width * .9}]}
                        />
                    </View>
                    <View style={styles.containerText}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: 'center',
                            flex: 1,
                        }}>
                            <Text style={{marginLeft: 8,}}>{item.name}</Text>
                            {iconText}
                        </View>
                        <Text style={{
                            marginRight: 4,
                            color: '#97979f',
                            fontSize: 12
                        }}>{item.profile_courtship ? item.profile_courtship.province : '未获取'} {item.profile_courtship?item.profile_courtship.city:'未获取'}</Text>
                    </View>
                    <View style={[styles.containerText, {marginTop: -8}]}>
                        <Text style={{marginLeft: 8, color: '#97979f', fontSize: 12}}>
                            {item.age} {item.profile_courtship?item.profile_courtship.stature + 'cm':'未获取'} {item.industry}/{item.industry_sub}
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
        // shadowColor: '#D92553',
        // shadowOffset: {width: 0, height: 0},
        // shadowOpacity: 22,
        // shadowRadius: 22,
        borderColor: '#d6d6d6',
        borderWidth: 2,
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
        marginLeft: 15,
        borderRadius: 50,
        borderColor: '#fff',
        borderWidth: 1,
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
        width: width*.7,
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
        marginTop: 3,
    },
    UserInfoEdit:{
        color: '#fff',
        borderWidth: 1,
        borderColor: '#fff',
        fontSize: 12,
        marginTop: 8,
        textAlign: 'center',
        borderRadius: 8,
        paddingLeft: 6,
        paddingRight: 6,
        paddingTop: 2,
        paddingBottom: 1,
    },
    UserTitle: {
        color: '#fff',
        // borderBottomWidth: 1,
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
    ItemRightStyle: {
        fontSize: 12,
        marginLeft: width*.48,
        marginTop: 7,
    }
});
