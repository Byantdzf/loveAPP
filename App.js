/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import {
    Navigation,
    Scene,
    Router,
    Modal
} from 'react-native-router-flux';
import IOS from './src/ios';
import Android from './src/android'
import Web from './src/web'
import TabIcon from './src/TabIcon'
import welcome from './src/welcome'
import login from './src/login';
import GrayScreen from './src/GrayScreen ';
import home from "./src/tabBar/home";
import user from "./src/tabBar/user";
import news from "./src/tabBar/news";
import userDetail from "./src/userDetail";
import protocol from "./src/protocol";
import test from "./src/test1";
import basics from './src/user/basics'; // 基本资料
import userData from "./src/user/data"; // 详细资料
import friends from './src/user/friends'  // 我的好友
import fans from './src/user/fans'  // 我的粉丝
import setting from './src/user/setting'  // 我的设置
import upgradeVIP from './src/upgrade/vipList' // 会员升级
import authentication from './src/user/authentication' // 实名认证
import wxPay from './src/wxPay'
import * as WeChat from "react-native-wechat";
// import news from "./src/tabBar/news"; // 微信测试
// const App = () => {
//     return (
//         <Router>
//             <Scene key="root">
//                 <Scene key="scarlet"
//                        component={ScarletScreen}
//                        title="登录"
//                        initial
//                 />
//                 <Scene
//                     key="gray"
//                     component={GrayScreen}
//                     title="Gray"
//                 />
//             </Scene>
//         </Router>
//     );
// }
//
// export default App;

type Props = {};
export default class App extends Component<Props> {
    // componentDidMount() {
    //     WeChat.registerApp('wx2aa846fb62df72c9');
    // }
    render() {
        return (
            <Router sceneStyle={{ backgroundColor: 'white' }}>
                <Modal>
                    <Scene key="root" tabBarPosition="bottom" tabs hideNavBar={true} activeTintColor={'#d92553'}>
                        <Scene hideBackImage
                               key="IOS"
                               title="主页"
                               component={home}
                               icon={TabIcon}
                               hideNavBar={true}
                               Image={require('./src/image/tabBar/home.png')}
                               selectedImage={require('./src/image/tabBar/homeActive.png')}

                        />

                        <Scene hideBackImage
                               key="news"
                               component={news}
                               title="消息"
                               icon={TabIcon}
                               hideNavBar={true}
                               Image={require('./src/image/tabBar/message.png')}
                               selectedImage={require('./src/image/tabBar/messageActive.png')}
                        />

                        <Scene hideBackImage
                               key="user"
                               component={user}
                               title="我的"
                               icon={TabIcon}
                               Image={require('./src/image/tabBar/my.png')}
                               hideNavBar={true}  //隐藏导航栏
                               selectedImage={require('./src/image/tabBar/myActive.png')}
                        />
                    </Scene>
                    <Scene key="test"
                           component={test}
                           title="测试"
                           hideNavBar={true}
                        // initial
                    />
                    <Scene key="welcome"
                           component={welcome}
                           title="启动页"
                           hideNavBar={true}
                           initial
                    />
                    <Scene key="login"
                           component={login}
                           title="登录"
                           hideNavBar={true}
                        // initial
                    />
                    <Scene
                        key="protocol"
                        component={protocol}
                        title="服务协议"
                    />
                    <Scene key="basics"
                           component={basics}
                           title="基本资料"
                           hideNavBar={true}
                        // initial
                    />
                    <Scene key="userData"
                           component={userData}
                           title="用户资料"
                           hideNavBar={true}
                    />
                    <Scene key="home"
                           component={home}
                           title="首页"
                           hideNavBar={true}
                        // initial
                    />
                    <Scene key="userDetail"
                           component={userDetail}
                           title="用户详情"
                           hideNavBar={true}
                    />
                    <Scene key="friends"
                           component={friends}
                           title="我的好友"
                           hideNavBar={true}
                    />
                    <Scene key="fans"
                           component={fans}
                           title="我的粉丝"
                           hideNavBar={true}
                    />
                    <Scene key="upgradeVIP"
                           component={upgradeVIP}
                           title="VIP升级"
                           hideNavBar={true}
                    />
                    <Scene key="authentication"
                           component={authentication}
                           title="实名认证"
                           hideNavBar={true}
                        // initial
                    />
                    <Scene key="setting"
                           component={setting}
                           title="设置"
                           hideNavBar={true}
                    />
                    <Scene key="wxPay"
                           component={wxPay}
                           title="微信测试"
                           hideNavBar={true}
                    />
                    <Scene
                        key="gray"
                        component={GrayScreen}
                        title="Gray"
                    />

                </Modal>
            </Router>
        );
    }

}

const styles = StyleSheet.create({
    tabbarContainer: {
        flex: 1,
        backgroundColor: "#f6f6f6",
        overflow: 'visible'
    },
    tabBar: {
        height: 70  //tabbar的高度
    },
    tabIconItem: {
        flex: 1,
        height: 56,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: 'transparent',
        overflow: 'visible'
    },
    tabIconImage: {
        width: 60,
        height: 60,
        overflow: 'visible'

    },
});
