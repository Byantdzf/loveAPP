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
import home from "./src/home";
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
import wxPay from './src/wxPay' // 实名认证
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
    render() {
        return (
            <Router>
                {/*<Modal>*/}
                <Scene key="root">
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
                           // initial
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
                           // initial
                    />
                    <Scene key="authentication"
                           component={authentication}
                           title="实名认证"
                           hideNavBar={true}
                    />
                    <Scene key="setting"
                           component={setting}
                           title="设置"
                           hideNavBar={true}
                    />
                    <Scene
                        key="gray"
                        component={GrayScreen}
                        title="Gray"
                    />
                    <Scene key="wxPay"
                           component={wxPay}
                           title="微信支付"
                           hideNavBar={true}
                        initial
                    />
                </Scene>
                {/*<Scene key="root" tabBarPosition="bottom" tabs>*/}
                {/*<Scene hideBackImage*/}
                {/*key="IOS"*/}
                {/*title="苹果"*/}
                {/*component={IOS}*/}
                {/*icon={TabIcon}*/}
                {/*showLabel = {false}*/}
                {/*Image={require('./src/image/ios.png')}*/}
                {/*selectedImage={require('./src/image/ios_active.png')}*/}
                {/*/>*/}

                {/*<Scene hideBackImage*/}
                {/*key="Web"*/}
                {/*component={Web}*/}
                {/*title="web"*/}
                {/*icon={TabIcon}*/}
                {/*Image={require('./src/image/web.png')}*/}
                {/*showLabel = {true}*/}
                {/*selectedImage={require('./src/image/web_active.png')}*/}
                {/*/>*/}

                {/*<Scene hideBackImage*/}
                {/*key="Android"*/}
                {/*component={Android}*/}
                {/*title="安卓"*/}
                {/*icon={TabIcon}*/}
                {/*Image={require('./src/image/android.png')}*/}
                {/*hideNavBar={true}  //隐藏导航栏*/}
                {/*selectedImage={require('./src/image/android_active.png')}*/}
                {/*/>*/}
                {/*</Scene>*/}
                {/*</Modal>*/}
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
