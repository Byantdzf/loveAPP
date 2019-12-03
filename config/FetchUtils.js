import React from "react";
import DeviceStorage from '../config/DeviceStorage';
import {Actions} from "react-native-router-flux";
import AsyncStorage from "@react-native-community/async-storage";
import {Toast,Modal} from '@ant-design/react-native';

/**
 * 让fetch也可以timeout
 *  timeout不是请求连接超时的含义，它表示请求的response时间，包括请求的连接、服务器处理及服务器响应回来的时间
 * fetch的timeout即使超时发生了，本次请求也不会被abort丢弃掉，它在后台仍然会发送到服务器端，只是本次请求的响应内容被丢弃而已
 * @param {Promise} fetch_promise    fetch请求返回的Promise
 * @param {number} [timeout=10000]   单位：毫秒，这里设置默认超时时间为10秒
 * @return 返回Promise
 */
function timeout_fetch(fetch_promise, timeout = 10000) {
    let timeout_fn = null;

    //这是一个可以被reject的promise
    let timeout_promise = new Promise(function (resolve, reject) {
        timeout_fn = function () {
            reject('timeout promise');
        };
    });

    //这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
    let abortable_promise = Promise.race([
        fetch_promise,
        timeout_promise
    ]);

    setTimeout(function () {
        timeout_fn();
    }, timeout);
    return abortable_promise;
}
 // let common_url = 'https://love.ufutx.com/api/';  //服务器地址
let common_url = 'http://love.hankin.ufutx.cn/api/';  //本地服务器地址
// DeviceStorage.get('token').then((res) => {
//     if (res == null || res == '') {
//         // setTimeout(() => {
//         //     Actions.login()
//         // }, 800)
//     } else {
//         token = res
//         console.log(token)
//     }
// })
let token = '';
function getToken (){
    AsyncStorage.getItem('token', function (error, result) {
        console.log(error, result + '哈哈啊哈哈');
        if (!error) {
            token = result === null ? '数据已经删除，现在取的是空值' : result
        }
    })
}
const fetchRequest = (url, method, params = '') =>{
    return new Promise(function (resolve, reject) {
        AsyncStorage.getItem('token', function (error, result) {
            token = result
            if (!error && result != null) { // 有token
                // console.log(token+'token')
                let header = {
                    "Content-Type": "application/json;charset=UTF-8",
                    "Authorization": 'Bearer ' + token  //用户登陆后返回的token，某些涉及用户数据的接口需要在header中加上token
                };
                console.log(header)
                console.log('request url:', url, params);  //打印请求参数
                let config = {
                    method: method,
                    headers: header,
                    body: JSON.stringify(params)   //body参数，通常需要转换成字符串后服务器才能解析
                }
                if (params == ''){
                    config = {
                        method: method,
                        headers: header
                    }
                }
                timeout_fetch(fetch(common_url + url, config)).then((response) => response.json())
                    .then((responseData) => {
                        console.log('res:', url, responseData);   //网络请求成功返回的数据
                        if (responseData.code == 1){
                            Toast.info(responseData.message)
                            Modal.alert('Sorry...', responseData.message, [
                                { text: '好吧！', onPress: () => console.log('ok') },
                            ]);
                            return
                        }
                        resolve(responseData);
                    })
                    .catch((err) => {
                        console.log('err:', url, err);   //网络请求失败返回的数据
                        reject(err);
                    });
            }else { // 无token
                // console.log(token+'token')
                let header = {
                    "Content-Type": "application/json;charset=UTF-8",
                    "Authorization": 'Bearer ' + token  //用户登陆后返回的token，某些涉及用户数据的接口需要在header中加上token
                };
                console.log(header)
                console.log('request url:', url, params);  //打印请求参数
                let config = {}
                if (params == '') {
                    config = {
                        method: method,
                        headers: header
                    }
                } else {
                    config = {
                        method: method,
                        headers: header,
                        body: JSON.stringify(params)   //body参数，通常需要转换成字符串后服务器才能解析
                    }
                }
                timeout_fetch(fetch(common_url + url, config)).then((response) => response.json())
                    .then((res) => {
                        console.log('res:', url, res);   //网络请求成功返回的数据
                        if (res.code == 2) {
                            Actions.login()
                            return
                        }
                        resolve(res);
                    })
                    .catch((err) => {
                        console.log('err:', url, err);   //网络请求失败返回的数据
                        reject(err);
                    });
            }
        })
    });
    // if (params == '') {   //如果网络请求中没带有参数
    //     return new Promise(function (resolve, reject) {
    //         timeout_fetch(fetch(common_url + url, {
    //             method: method,
    //             headers: header
    //         })).then((response) => response.json())
    //             .then((responseData) => {
    //                 console.log('res:', url, responseData);  //网络请求成功返回的数据
    //                 if (responseData.code == 2) {
    //                     return  Actions.login()
    //                 }
    //                 resolve(responseData);
    //             })
    //             .catch((err) => {
    //                 console.log('err:', url, err);     //网络请求失败返回的数据
    //                 reject(err);
    //                 alert('网络异常！请重试...')
    //             });
    //     });
    // } else {   //如果网络请求中有参数
    //     return new Promise(function (resolve, reject) {
    //         timeout_fetch(fetch(common_url + url, {
    //             method: method,
    //             headers: header,
    //             body: JSON.stringify(params)   //body参数，通常需要转换成字符串后服务器才能解析
    //         })).then((response) => response.json())
    //             .then((responseData) => {
    //                 console.log('res:', url, responseData);   //网络请求成功返回的数据
    //                 resolve(responseData);
    //             })
    //             .catch((err) => {
    //                 console.log('err:', url, err);   //网络请求失败返回的数据
    //                 reject(err);
    //             });
    //     });
    // }
}
// module.exports = fetchRequest;
export {fetchRequest}
