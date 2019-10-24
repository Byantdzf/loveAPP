
import React, { Component } from "react";

import { Image, FlatList, StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator, Linking} from "react-native";
import {fetchRequest} from '../config/FetchUtils';
import {Toast, Provider, Carousel, Modal} from "@ant-design/react-native";
import {Actions} from "react-native-router-flux";
import ActionButton from 'react-native-action-button';
const REQUEST_URL =
    "https://raw.githubusercontent.com/facebook/react-native/0.51-stable/docs/MoviesExample.json";

export default class SampleAppMovies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            user: {},
            page: 1,
            keyword: '',
            loaded: false
        };
        // 在ES6中，如果在自定义的函数里使用了this关键字，则需要对其进行“绑定”操作，否则this的指向会变为空
        // 像下面这行代码一样，在constructor中使用bind是其中一种做法（还有一些其他做法，如使用箭头函数等）
        this.fetchData = this.fetchData.bind(this);
    }
    call = phone => {
        const url = `tel:${phone}`;
        Linking.canOpenURL(url)
            .then(supported => {
                if (!supported) {
                    return Alert.alert('提示', `您的设备不支持该功能，请手动拨打 ${phone}`, [
                        { text: '确定' }
                    ]);
                }
                return Linking.openURL(url);
            })
            .catch(err => Toast.info(`出错了：${err}`, 1.5));
    };

    callMerchant = () => {
        Modal.alert('有好感？', '拨打红娘电话，帮你约Ta', [
            {
                text: '取消',
                onPress: () => console.log('cancel'),
                style: 'cancel',
            },
            { text: '拨打', onPress: () => this.call('18194066804')}
        ]);
    };

    componentDidMount() {
        this.fetchData();
    }
    fetchData() {
        fetchRequest(`official/app/users/`+ this.props.id, 'GET')
        // fetchRequest(`official/app/users/161`, 'GET')
            .then(res => {
                console.log(res.data)
                this.setState({
                    user: res.data,
                    loaded: true
                });
                console.log(this.state.user)
            }).catch(err => {
            console.log(`异常: ${err}`);
        })
    }
    onHorizontalSelectedIndexChange(index) {
        /* tslint:disable: no-console */
        console.log('horizontal change to', index);
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }

        return (
            <Provider>
                {this.renderDetail()}
            </Provider>
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

    renderDetail( ) {
        let man = {uri: 'https://images.ufutx.com/201910/21/a92b5d29dedb9932568f97fcdff865bc.png'};
        let woman = {uri: 'https://images.ufutx.com/201910/21/40b26d71cf2af9b1be0f874605c6ef2f.png'};
        const {user} = this.state
        let items = user.profile_photos.map((item, index) => {
            return {
                uri: item.photo
            }
        })
        console.log(items)
        let iconText = user.sex == 1 ?
            <Image source={man} style={[styles.iconStyle]}/> :
            <Image source={woman} style={[styles.iconStyle]}/>;
        return (
            <View style={{backgroundColor: "#fff", minHeight: height,}}>
                <ScrollView>
                    <View>
                        <Carousel
                            style={styles.wrapper}
                            selectedIndex={2}
                            autoplay
                            infinite
                            afterChange={this.onHorizontalSelectedIndexChange}
                        >
                            {/* 方式1 */}
                            {/*{items.map((item) => {*/}
                                {/*return (*/}
                                    {/*<Text>{item}</Text>*/}
                                {/*);*/}
                            {/*})}*/}
                            {/* 方式2 */}
                            {/* {items.map((item) => this.textComponent(item))} */}
                            {items.map((item, index) => {
                                return (
                                    <Image
                                        source={item}
                                        id={index}
                                        style={[styles.thumbnail,{width: width, height: width}]}
                                    />
                                );
                            })}
                        </Carousel>
                    </View>
                    <View style={styles.containerText}>
                        <View style={{flexDirection: "row", justifyContent: "flex-start",alignItems: 'center', flex: 1,}}>
                            <Text style={{marginLeft: 8,fontSize: 16}}>{user.name}</Text>
                            {iconText}
                        </View>
                        <Text style={{marginRight: 4,marginTop: 4,color: '#97979f',fontSize: 12}}>{user.login_time_str}活跃</Text>
                    </View>
                    <View style={[styles.containerText,{marginTop: -6}]}>
                        <Text style={{marginLeft: 8,color: '#97979f',fontSize: 12}}>
                            {user.age} {user.profile_courtship.stature+'cm'} {user.industry}/{user.industry_sub}
                        </Text>
                    </View>
                    {/*原始ui*/}
                    {/*<View style={[styles.containerText,{marginTop: 12,justifyContent: "flex-start",flexDirection: 'column'}]}>*/}
                        {/*<Text style={{marginLeft: 8,fontSize: 16}}>择偶意向</Text>*/}
                        {/*<View style={{width: 32,height: 6,backgroundColor: '#EFA6B7',marginLeft: 9,marginTop: -8,opacity: .8}}></View>*/}
                    {/*</View>*/}
                    <View style={[styles.dotStyle,{width: width}]}></View>
                    <View style={[styles.containerText,{marginTop: 12}]}>
                        <Text style={{marginLeft: 8,fontSize: 16}}>个人资料</Text>
                    </View>
                    <View style={[styles.containerText,{marginTop: -4}]}>
                        {this.userBasics()}
                    </View>
                    <View style={[styles.dotStyle2]}>{/*横线*/}</View>
                    <View style={[styles.containerText,{marginTop: 12}]}>
                        <Text style={{marginLeft: 8,fontSize: 16}}>个人介绍</Text>
                    </View>
                    <View style={[styles.containerText,{marginTop: -4}]}>
                        <Text style={styles.TextStyle}>{user.profile_courtship.introduction}</Text>
                    </View>
                    <View style={[styles.dotStyle2]}>{/*横线*/}</View>
                    <View style={[styles.containerText,{marginTop: 12}]}>
                        <Text style={{marginLeft: 8,fontSize: 16}}>择偶意向</Text>
                    </View>
                    <View style={[styles.containerText,{marginTop: -4}]}>
                        <Text style={styles.TextStyle}>{user.profile_courtship.ideal_mate}</Text>
                    </View>
                    <View style={[styles.dotStyle2]}>{/*横线*/}</View>
                    <View style={[styles.containerText,{marginTop: 12}]}>
                        <Text style={{marginLeft: 8,fontSize: 16}}>Ta的认证</Text>
                    </View>
                    {this.userApproved()}
                    <View style={{height: 100}}>{/*占位*/}</View>
                </ScrollView>
                {/*<ActionButton*/}
                    {/*buttonColor="rgba(231,76,60,1)"*/}
                    {/*onPress={() => { console.log("hi")}}*/}
                {/*/>*/}
                <ActionButton buttonColor="#D92553">
                    <ActionButton.Item buttonColor='rgba(231,76,60,0)' title="主页" onPress={() => Actions.home()}>
                        <Image
                            source={{uri: 'https://images.ufutx.com/201910/22/44641052ec087246a15e8551df3adfac.png'}}
                            style={[styles.thumbnail,{width: 80, height: 80,marginTop: 12}]}
                        />
                    </ActionButton.Item>
                    <ActionButton.Item buttonColor='rgba(231,76,60,0)' title="帮我联系Ta" onPress={this.callMerchant}>
                        <Image
                            source={{uri: 'https://images.ufutx.com/201910/22/54a015f92ad58f0583f163c334782c24.png'}}
                            style={[styles.thumbnail,{width: 80, height: 80,marginTop: 12}]}
                        />
                    </ActionButton.Item>
                    {/*<ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {}}>*/}
                        {/*<Icon name="md-notifications-off" style={styles.actionButtonIcon} />*/}
                    {/*</ActionButton.Item>*/}
                    {/*<ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => {}}>*/}
                        {/*<Icon name="md-done-all" style={styles.actionButtonIcon} />*/}
                    {/*</ActionButton.Item>*/}
                </ActionButton>
            </View>
        );
    }
    // 基本资料
    userBasics() {
        const {user} = this.state
        let age = user.age ?
            <Text style={styles.itemStyle}>{'年龄：' + user.age} </Text> : null,
            stature = user.profile_courtship.stature ?
                <Text style={styles.itemStyle}>{user.profile_courtship.stature + 'cm'} </Text> : null,
            weight = user.profile_courtship.weight ?
                <Text style={styles.itemStyle}>{user.profile_courtship.weight + 'kg'} </Text> : null,
            state = user.profile_courtship.state ?
                <Text style={styles.itemStyle}>{user.profile_courtship.state} </Text> : null,
            birthday = user.profile_courtship.birthday ?
                <Text style={styles.itemStyle}>{user.profile_courtship.birthday} </Text> : null,
            city = user.profile_courtship.city ? <Text
                style={styles.itemStyle}>{user.profile_courtship.province + '-' + user.profile_courtship.city} </Text> : null,
            resident_city = user.profile_courtship.resident_city ? <Text
                style={styles.itemStyle}>{'户籍（老家）：' + user.profile_courtship.resident_province + '-' + user.profile_courtship.resident_city} </Text> : null,
            resident_type = user.profile_courtship.resident_type ? <Text
                style={styles.itemStyle}>{'成长环境：' + user.profile_courtship.resident_type} </Text> : null,
            graduate_school = user.profile_courtship.graduate_school ? <Text
                style={styles.itemStyle}>{'毕业学校：' + user.profile_courtship.graduate_school} </Text> : null,
            industry = user.profile_courtship.industry_sub ? <Text
                style={styles.itemStyle}>{'行业：' + user.profile_courtship.industry + '-' + user.profile_courtship.industry_sub} </Text> : null,
            company = user.profile_courtship.company ? <Text
                style={styles.itemStyle}>{'公司：' + user.profile_courtship.company} </Text> : null,
            work_sort = user.profile_courtship.work_sort ? <Text
                style={styles.itemStyle}>{'公司类型：' + user.profile_courtship.work_sort} </Text> : null,
            post = user.profile_courtship.post ? <Text
                style={styles.itemStyle}>{'公司职位：' + user.profile_courtship.post} </Text> : null,
            belief = user.profile_courtship.belief ? <Text
                style={styles.itemStyle}>{'信仰：' + user.profile_courtship.belief} </Text> : null
        return (
            <View style={[styles.containerItem, {}]}>
                {age}{stature}{weight}{state}{birthday}{city}{resident_city}{resident_type}
                {graduate_school}{industry}{company}{work_sort}{post}{belief}
            </View>
        )
    }
    userApproved() {
        const {user} = this.state
        let idIon = {uri: 'https://images.ufutx.com/201910/22/a7f9ce4f49c5b1124552813193e7dfa0.png'};
        if (user.is_approved === 0) {
            return
        }
        return (
            <View style={[styles.containerText,{marginTop: -4}]}>
                <View style={[styles.containerText,{backgroundColor: '#F5E9ED',padding: 22, flex: 1, borderColor: '#d92553',borderWidth: 1,}]}>
                    <Image
                        source={idIon}
                        style={[{width: 80, height: 48,marginTop: 10,}]}/>
                    <View>
                        <Text style={{alignSelf: 'flex-end'}}>{user.name}</Text>
                        <Text style={{alignSelf: 'flex-end'}}>{user.card_num}</Text>
                        <Text style={{
                            alignSelf: 'flex-end',
                            color: '#5f5f6b',
                            marginTop: 2
                        }}>
                            {user.created_at.split(' ')[0].split('-')[0] + '年' + user.created_at.split(' ')[0].split('-')[1] + '月' + user.created_at.split(' ')[0].split('-')[2] + '日'} 加入
                            <Text style={{color: '#D92553'}}>福恋</Text>
                        </Text>
                    </View>
                </View>
            </View>
        )
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
        margin: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: 'wrap',
    },
    containerItem: {
        margin: 10,
        flexDirection: "row",
        justifyContent: "flex-start",
        flexWrap: 'wrap',
        marginLeft: 8,
        marginTop: -4,
    },
    TextStyle: {
        marginLeft: 8,
        fontSize: 14,
        color: '#5f5f6b',
        marginTop: 6,
        marginBottom: 6
    },
    iconStyle: {
        width: 16, height: 16, marginLeft: 2,
    },
    dotStyle: {
        height: 4,
        backgroundColor: '#f6f6f6'
    },
    dotStyle2: {
        width: width*.92,
        alignSelf: 'center',
        height: 1,
        backgroundColor: '#b0b0b0'
    },
    list: {
        backgroundColor: "#fff"
    },
    itemStyle: {
        backgroundColor: '#f6f6f6',
        fontSize: 14,
        color: '#5f5f6b',
        marginRight: 8,
        padding: 8,
        paddingTop: 1,
        paddingBottom: 1,
        borderRadius: 3,
        marginTop: 10,
    }
});
