import React, {Component} from 'react';
import {Image, Text, View, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import {fetchRequest} from '../../config/FetchUtils';
import {Button, InputItem, List, Toast, Provider, Modal, Portal} from '@ant-design/react-native';
import AsyncStorage from "@react-native-community/async-storage";
import ImagePicker from 'react-native-image-crop-picker';
import base64 from 'react-native-base64'

export default class commonUpload extends Component {
    constructor(props) { // 初始化数据
        super(props);
        this.state = {
            ossConfig: {},
            image: '',
            visible: true
        }

        this.onClose = () => {
            console.log(this.state.visible)
            this.setState({
                visible: false
            })
        }
    }
    static defaultProps = {
        visible: false
    }

    componentWillMount() { // 即将要渲染虚拟DOM，在render函数前，只执行一次
    }

    //已经加载虚拟DOM，在render之后，只执行一次，可在此完成异步网络请求或集成其他JavaScript库
    componentDidMount() {
        this.getSignature()
    }

    console() {
        this.setState({
            visible: true
        })
    }

    getSignature() { // 获取上传签证
        fetchRequest('upload/signature', 'GET')
            .then(res => {
                console.log(res.data)
                this.setState({
                    ossConfig:  res.data
                });
                console.log(this.state.ossConfig)
            }).catch(err => {
            console.log(`异常: ${err}`);
        })
    }
    post (file) {
        console.log(file)
        let ToastKey = Toast.loading('图片上传中')
        let fileName = file.path.split('/')[file.path.split('/').length-1].split('.')
        fileName = `${base64.encode(fileName[0])}.${fileName[1]}`
        let formData = new FormData()
        let imageName = file.path.split('/')[file.path.split('/').length-1]
        let filePath = this.state.ossConfig.host + '/' + this.state.ossConfig.dir + fileName
        formData.append('key', this.state.ossConfig.dir + fileName)
        formData.append('policy', this.state.ossConfig.policy)
        formData.append('OSSAccessKeyId', this.state.ossConfig.accessid)
        formData.append('success_action_status', '200')
        formData.append('signature', this.state.ossConfig.signature)
        formData.append('file', {
            uri: file.path,
            type: file.mime,
            name: imageName
        })
        console.log(formData)
        let token;
        AsyncStorage.getItem('token', (error, result) => {
            // if (!error && result != null) {
                token = result === null ? '数据已经删除，现在取的是空值' : result
                // console.log(token)
                fetch(this.state.ossConfig.host, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        // "Authorization": 'Bearer ' + token  //用户登陆后返回的token
                    },
                    body: formData,
                }).then((data) => {
                    console.log(data)
                    this.setState({
                        image: filePath,
                        visible: false
                    })
                    Portal.remove(ToastKey)
                    Toast.success('上传成功');
                    this.props.getImagePath(filePath)
                    console.log(filePath)
                }).catch((error) => {
                    console.log(error)
                });
            // }
        })

    }

    openPicker() { // 打开照片
        ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropperCircleOverlay: true,
            cropping: true
        }).then(image => {
            console.log(image);
            this.post(image)
        });
    }

    openCamera() {
        ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image);
            this.post(image)
        });
    }

    openPickerVideo() {
        ImagePicker.openPicker({
            mediaType: "video",
        }).then((video) => {
            console.log(video);
            this.post(image)
        });
    }

    openCropper() {
        ImagePicker.openCropper({
            path: 'my-file-path.jpg',
            width: 300,
            height: 400
        }).then(image => {
            console.log(image);
            this.post(image)
        });
    }


    render() {
        return (
            <Provider>
                <Modal
                    popup
                    visible={this.state.visible}
                    animationType="slide-up"
                    onClose={this.onClose}
                    maskClosable
                    // transparent
                    style={styles.modal}
                >
                    <View style={styles.modalBox}>
                        {/*<TouchableOpacity onPress={() => {*/}
                            {/*this.openPicker('image')*/}
                        {/*}}>*/}
                            <View style={[styles.btnStyle,{borderTopRightRadius: 8,borderTopLeftRadius: 8,padding: 12,}]}>
                                <Text style={[styles.textStyle,{fontSize: 14,color: '#bbbbbb'}]}>选择你的头像</Text>
                            </View>
                        {/*</TouchableOpacity>*/}
                        <TouchableOpacity activeOpacity={1}
                            onPress={() => {
                            this.openPicker('image')
                        }}>
                            <View style={styles.btnStyle}>
                                <Text style={styles.textStyle}>从相册中选择</Text>
                            </View>
                        </TouchableOpacity>
                        {/*<TouchableOpacity onPress={() => {*/}
                            {/*this.openPickerVideo('video')*/}
                        {/*}}>*/}
                            {/*<View style={styles.btnStyle}>*/}
                                {/*<Text style={styles.textStyle}>点击上传视频</Text>*/}
                            {/*</View>*/}
                        {/*</TouchableOpacity>*/}
                        <TouchableOpacity activeOpacity={1}
                            onPress={() => {
                            this.openCamera('video')
                        }}>
                            <View style={styles.btnStyle}>
                                <Text style={styles.textStyle}>拍照</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1}
                            onPress={this.onClose}>
                            <View style={[styles.btnStyle,{borderBottomRightRadius: 8,borderBottomLeftRadius: 8,}]}>
                                <Text style={[styles.textStyle,{color: '#da4f53'}]}>取消</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </Provider>
        );
    }
}
const {width, height, scale} = Dimensions.get('window');
const styles = StyleSheet.create({
    modal: {
        backgroundColor: 'transparent',
        marginBottom: 16,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    modalBox: {
        borderRadius: 8,
    },
    btnStyle: {
        width: width-30,
        alignItems: 'center',
        backgroundColor: "#ffffff",
        padding: 16,
        borderBottomWidth: .8,
        borderBottomColor: '#f0f0f0'
    },
    textStyle: {
        fontSize: 16,
        color: '#148cf1'
    }
});
