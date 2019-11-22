import React, {Component} from 'react';
import {
    Image,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageBackground,
    TextInput,
    DatePickerIOS,
    ScrollView,
    StatusBar
} from 'react-native';
import {Actions} from "react-native-router-flux";
import {fetchRequest} from '../../config/FetchUtils';
import {Button, InputItem, List, Toast, Provider, Drawer, TextareaItem, Picker} from '@ant-design/react-native';
import DeviceStorage from '../../config/DeviceStorage';
import Pickers from '../../config/Picker'
import DatePicker from 'react-native-datepicker'
import AsyncStorage from "@react-native-community/async-storage";
// import Basics from '../../src/user/basics'
import CommonAvatar from '../components/commonAvatar'

export default class userData extends Component {
    constructor(props) { // 初始化数据
        super(props);
        this.state = {
            value: [],
            data: [],
            name: '',
            visible: false, // 抽屉开不开
            sex: '男',
            belief: '其他',
            datetime: '1990-01-01',
            cityAll: [],
            textType: '', // 文本内容
            avatar: {uri: 'https://images.ufutx.com/201911/20/f936c7bcd8805d1f0db3743c5c157601.png'},
            userData: {},
            state: "从未结婚",
            stature: 168,
            weight: 46,
            ideal_mate: '', // 自我介绍
            introduction: '', // 理想对象
            company: "",
            post: '', // 职位
            work_sort: "",
            country: "中国",
            province: "广东省",
            city: "深圳市",
            dist: "龙岗区",
            degree: "",
            graduate_school: "",
            resident_province: "广东省",
            resident_city: "梅州市",
            resident_dist: "梅江区",
            resident_type: "城市",
            industries: [],
            industry: '',
            industry_sub: ''
        }
        this.onOpenChange = isOpen => {
            console.log('是否打开了 Drawer', isOpen.toString());
        };
        this.onPress = () => {
            setTimeout(() => {
                this.setState({
                    data: district,
                });
            }, 500);
        };
    }

    login() {
        console.log()
        if (!this.state.name) {
            Toast.offline('请填写昵称');
            this.inputRef.focus();
            return
        }
        // console.log(this.state.mobile.replace(/\s+/g, ""))
        let data = {
            photo: this.state.avatar.uri,
            name: this.state.name,
            sex: this.state.sex === '男' ? '1' : '2',
            belief: this.state.belief,
            birthday: this.state.datetime,
            stature: this.state.stature,
            weight: this.state.weight,
            company: this.state.company,
            post: this.state.post,
            ideal_mate: this.state.ideal_mate,
            introduction: this.state.introduction,
            state: this.state.state,
            resident_type: this.state.resident_type,
            degree: this.state.degree,
            work_sort: this.state.work_sort,
            graduate_school: this.state.graduate_school,
            country: this.state.country,
            province: this.state.province,
            city: this.state.city,
            dist: this.state.dist,
            resident_province: this.state.resident_province,
            resident_city: this.state.resident_city,
            resident_dist: this.state.resident_dist,
            industry: this.state.industry,
            industry_sub: this.state.industry_sub,
        }
        console.log(data)
        Toast.loading('保存信息中...', .8);
        fetchRequest('official/app/user/profile', 'PUT', data)
            .then(res => {
                console.log(res)
                Toast.success('保存成功');
                Actions.home()
            }).catch(err => {
            console.log(`异常: ${err}`);
        })
    }

    selectSex() {
        Pickers.show(['男', '女'], this.state.sex, (value) => {
            console.log(value)
            this.setState({
                sex: value.join(','),
            });
        })
    }

    selectState() {
        Pickers.show(['从未结婚','离异','丧偶'], this.state.state, (value) => {
            console.log(value)
            this.setState({
                state: value.join(','),
            });
        })

    }

    selectResidentType() {
        Pickers.show(['城市','乡村'], this.state.resident_type, (value) => {
            console.log(value)
            this.setState({
                resident_type: value.join(','),
            });
        })

    }

    selectDegree() {
        let list = ['大专', '本科', '硕士', '博士', '其他']
        Pickers.show(list, this.state.degree, (value) => {
            console.log(value)
            this.setState({
                degree: value.join(','),
            });
        })
    }

    selectWorkSort() {
        let list = ['事业单位', '公务员', '央企', '国企', '私企', '外企']
        Pickers.show(list, this.state.work_sort, (value) => {
            console.log(value)
            this.setState({
                work_sort: value.join(','),
            });
        })
    }

    selectBelief() {
        let beliefs = ['基督教', '佛教', '伊斯兰教', '其他']
        Pickers.show(beliefs, this.state.belief, (value) => {
            this.setState({
                belief: value.join(','),
            });
        })
    }

    getCity() {
        fetchRequest('official/app/addresses', 'GET')
            .then(res => {
                console.log(res.data)
                let cityList = res.data.map((item, index, arr) => {
                    // console.log(item, index, arr)
                    return {
                        value: item.name,
                        label: item.name,
                        children: this.getCityItem(item)
                    }
                })
                this.setState({
                    cityAll: cityList
                })
                console.log(this.state.cityAll,'cityList');
            }).catch(err => {
            console.log(`异常: ${err}`);
        })
    }

    getCityItem(item) {
        let city_sub  = item.son.map((itemV, index, arr) => {
            return {
                value: itemV.name,
                label: itemV.name,
                children: itemV.son?this.getCityItem(itemV):[]
            }
        })
        return city_sub
    }

    getIndustries() {
        fetchRequest('official/app/industries', 'GET')
            .then(res => {
                console.log(res.data)
                let list = res.data.map((item, index, arr) => {
                    return {
                        value: item.name,
                        label: item.name,
                        children: this.getIndustryItem(item)
                    }
                })
                this.setState({
                    industries: list
                })
                console.log(this.state.industries,'industries');
            }).catch(err => {
            console.log(`异常: ${err}`);
        })
    }
    getIndustryItem(item) {
        let industry_sub  = item.sub_industry.map((itemV, index, arr) => {
            return {
                value: itemV.name,
                label: itemV.name
            }
        })
        return industry_sub
    }

    getUser() {
        fetchRequest('official/app/user/profile', 'GET')
            .then(res => {
                let {name, profile_courtship, photo} = res.data
                console.log(res.data)
                if (profile_courtship) {
                    this.setState({
                        name: name,
                        sex: profile_courtship.sex == 1 ? '男' : '女',
                        belief: profile_courtship.belief,
                        datetime: profile_courtship.birthday,
                        avatar: {uri: photo ? photo : 'https://images.ufutx.com/201911/20/f936c7bcd8805d1f0db3743c5c157601.png'},
                        stature: profile_courtship.stature,
                        weight: profile_courtship.weight,
                        company: profile_courtship.company,
                        post: profile_courtship.post,
                        ideal_mate: profile_courtship.ideal_mate?profile_courtship.ideal_mate:'',
                        introduction: profile_courtship.introduction?profile_courtship.introduction:'',
                        state: profile_courtship.state?profile_courtship.state:'从未结婚',
                        resident_type: profile_courtship.resident_type?profile_courtship.resident_type:'城市',
                        degree: profile_courtship.degree?profile_courtship.degree:'大专',
                        graduate_school: profile_courtship.graduate_school,
                        work_sort: profile_courtship.work_sort,
                        country: profile_courtship.country?profile_courtship.country:'中国',
                        province: profile_courtship.province?profile_courtship.province:'广东省',
                        city: profile_courtship.city?profile_courtship.city:'深圳市',
                        dist: profile_courtship.dist,
                        resident_province: profile_courtship.resident_province,
                        resident_city: profile_courtship.resident_city?profile_courtship.resident_city:'广东省',
                        resident_dist: profile_courtship.resident_dist?profile_courtship.resident_dist:'深圳市',
                        industry: res.data.industry?res.data.industry:'专业服务',
                        industry_sub: res.data.industry_sub?res.data.industry_sub:'法律咨询'
                    });
                }
            }).catch(err => {
            console.log(`异常: ${err}`);
        })
    }

    componentWillMount() { // 即将要渲染虚拟DOM，在render函数前，只执行一次
    }

    //已经加载虚拟DOM，在render之后，只执行一次，可在此完成异步网络请求或集成其他JavaScript库
    componentDidMount() {
        this.getUser()
        this.getCity()
        this.getIndustries()
    }

    getImagePath(image) { //获取上传图片
        // Toast.success('上传成功');
        console.log(image, 'filePath')
        this.setState({
            avatar: {uri: image}
        })
    }

    renderSidebar() {
        if (this.state.textType == 'introduce') {
            return (
                <View style={{padding:12,}}>
                    <Text style={{fontSize: 18,marginLeft: 8,}}>自我介绍</Text>
                    <TextareaItem rows={4}
                                  placeholder="说一些自我介绍吧！"
                                  count={100}
                                  value={this.state.ideal_mate}
                                  onChange={value => {
                                      this.setState({
                                          ideal_mate: value,
                                      });
                                  }}
                    />
                    <View style={[styles.btnStyle,{marginTop: 22}]}
                          onTouchEnd={() => {
                              this.drawer && this.drawer.closeDrawer()
                          }}
                    >
                        <Text style={styles.textStyle}>保存</Text>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={{padding:12,}}>
                    <Text style={{fontSize: 18,marginLeft: 8,}}>理想对象</Text>
                    <TextareaItem rows={4}
                                  placeholder="说说你的理想对象是怎样的？？？"
                                  count={100}
                                  value={this.state.introduction}
                                  onChange={value => {
                                      this.setState({
                                          introduction: value,
                                      });
                                  }}
                    />
                    <View style={[styles.btnStyle,{marginTop: 22}]}
                          onTouchEnd={() => {
                              this.drawer && this.drawer.closeDrawer()
                          }}
                    >
                        <Text style={styles.textStyle}>保存</Text>
                    </View>
                </View>
            )
        }
    }

    renderAvatar() {
        let backPic = {uri: 'https://images.ufutx.com/201911/20/2f03aa6c5960592f7f28aa1c6cdb35c4.png'};
        return (
            <View>
                <Image source={backPic} style={styles.backPic}/>
                <View onTouchEnd={() => {
                    this.refs.app.openPicker()
                }}>
                    <Image source={this.state.avatar} style={styles.uploadIcon}/>
                </View>
            </View>
        )
    }

    renderBasice() {
        let codeIcon = {uri: 'https://images.ufutx.com/201910/17/70c4a203145a1bbc535b0524a5133bee.png'};
        let rightIcon = <Image source={codeIcon} style={styles.icon}/>
        return (
            <View style={{backgroundColor: '#ffffff',}}>
                <View style={[styles.touchConainer, {width: width}]}>
                    <Text style={{color: '#666', padding: 12, paddingTop: 0}}>基本资料</Text>
                    <List style={styles.box}>
                        <InputItem
                            textAlign='end'
                            style={[styles.InputItemStyle]}
                            value={this.state.name}
                            ref={el => (this.inputRef = el)}
                            onChange={value => {
                                this.setState({
                                    name: value,
                                });
                            }}
                            // extra={<Image source={codeIcon} style={styles.icon}/>}
                            placeholder="昵称"
                        >
                            昵称
                        </InputItem>
                        <TouchableOpacity onPress={() => {
                            this.selectSex()
                        }}>
                            <InputItem
                                textAlign='end'
                                value={this.state.sex}
                                style={styles.InputItemStyle}
                                editable={false}
                                placeholder="性别"
                                extra={rightIcon}
                            >
                                性别
                            </InputItem>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.selectBelief()
                        }}>
                            <InputItem
                                textAlign='end'
                                value={this.state.belief}
                                style={styles.InputItemStyle}
                                editable={false}
                                placeholder="信仰"
                                extra={rightIcon}
                            >
                                信仰
                            </InputItem>
                        </TouchableOpacity>
                        <View style={styles.DatePickerBox}>
                            <Text style={[styles.DatePickerText, {width: width * .2,}]}>出生日期</Text>
                            <View style={{flexDirection: 'row'}}>
                                <DatePicker
                                    style={styles.dateStyle}
                                    date={this.state.datetime}
                                    customStyles={{
                                        dateInput: {
                                            marginLeft: 22,
                                            borderColor: '#fff',
                                            lineHeight: 16,
                                            height: 22,
                                            fontSize: 100,
                                            transform: [{scale: 1.08}]
                                        },
                                        dateText: {
                                            color: '#666',
                                        }
                                    }}
                                    mode="date"
                                    placeholder="选择"
                                    format="YYYY-MM-DD"
                                    confirmBtnText="确定"
                                    cancelBtnText="取消"
                                    iconComponent={rightIcon}
                                    showIcon={true}
                                    onDateChange={(date) => {
                                        this.setState({datetime: date})
                                    }}
                                />
                            </View>
                        </View>
                    </List>
                </View>
            </View>
        )
    }

    renderUserData() {
        let codeIcon = {uri: 'https://images.ufutx.com/201910/17/70c4a203145a1bbc535b0524a5133bee.png'};
        let rightIcon = <Image source={codeIcon} style={styles.icon}/>
        return (
            <View style={{backgroundColor: '#ffffff',}}>
                <View style={styles.line}></View>
                <View style={[styles.touchConainer, {width: width}]}>
                    <Text style={{color: '#666', padding: 12, paddingTop: 0}}>详细资料</Text>
                    <List style={styles.box}>
                        <TouchableOpacity onPress={() => {this.selectState()}}>
                            <InputItem
                                textAlign='end'
                                value={this.state.state}
                                style={styles.InputItemStyle}
                                editable={false}
                                placeholder="单身状态"
                                extra={rightIcon}
                            >
                                单身状态
                            </InputItem>
                        </TouchableOpacity>
                        <InputItem
                            textAlign='end'
                            style={[styles.InputItemStyle]}
                            value={`${this.state.stature}`}
                            onChange={value => {
                                this.setState({
                                    stature: value,
                                });
                            }}
                            type="number"
                            extra={<Text style={{color: '#666'}}>cm </Text>}
                            placeholder="填写身高"
                        >
                            身高
                        </InputItem>
                        <InputItem
                            textAlign='end'
                            style={[styles.InputItemStyle]}
                            value={`${this.state.weight}`}
                            type="number"
                            onChange={value => {
                                this.setState({
                                    weight: value,
                                });
                            }}
                            extra={<Text style={{color: '#666'}}>kg </Text>}
                            placeholder="填写体重"
                        >
                            体重
                        </InputItem>
                        <Picker
                            data={this.state.cityAll}
                            cols={3}
                            value={this.state.value}
                            itemStyle={styles.picker}
                            // indicatorStyle={{color: 'pink'}}
                            onOk={value => {
                                console.log(value, 'sa')
                                this.setState({
                                    country: value[0],
                                    province: value[1],
                                    city: value[2],
                                });
                            }}
                        >
                            <TouchableOpacity onPress={() => {
                            }}>
                                <InputItem
                                    textAlign='end'
                                    value={`${this.state.province}-${this.state.city}`}
                                    style={styles.InputItemStyle}
                                    editable={false}
                                    placeholder="请选择"
                                    extra={rightIcon}
                                >
                                    现住址
                                </InputItem>
                            </TouchableOpacity>
                        </Picker>
                        <TouchableOpacity onPress={() => {
                            this.selectResidentType()
                        }}>
                            <InputItem
                                textAlign='end'
                                value={this.state.resident_type}
                                style={styles.InputItemStyle}
                                editable={false}
                                placeholder="成长环境"
                                extra={rightIcon}
                            >
                                成长环境
                            </InputItem>
                        </TouchableOpacity>
                        <Picker
                            data={this.state.cityAll}
                            cols={3}
                            value={this.state.value}
                            itemStyle={styles.picker}
                            // indicatorStyle={{color: 'pink'}}
                            onOk={value => {
                                console.log(value, 'sa')
                                this.setState({
                                    resident_city: value[1],
                                    resident_dist: value[2],
                                });
                            }}
                        >
                            <TouchableOpacity onPress={() => {
                            }}>
                                <InputItem
                                    textAlign='end'
                                    value={`${this.state.resident_city}-${this.state.resident_dist}`}
                                    style={styles.InputItemStyle}
                                    editable={false}
                                    placeholder="请选择"
                                    extra={rightIcon}
                                >
                                    成长地
                                </InputItem>
                            </TouchableOpacity>
                        </Picker>
                        <TouchableOpacity onPress={() => {
                            this.selectDegree()
                        }}>
                            <InputItem
                                textAlign='end'
                                value={this.state.degree}
                                style={styles.InputItemStyle}
                                editable={false}
                                placeholder="最高学历"
                                extra={rightIcon}
                            >
                                最高学历
                            </InputItem>
                        </TouchableOpacity>
                        <InputItem
                            textAlign='end'
                            style={[styles.InputItemStyle]}
                            value={this.state.graduate_school}
                            onChange={value => {
                                this.setState({
                                    graduate_school: value,
                                });
                            }}
                            placeholder="毕业学校"
                        >
                            毕业学校
                        </InputItem>
                        <InputItem
                            textAlign='end'
                            style={[styles.InputItemStyle]}
                            value={this.state.company}
                            ref={el => (this.inputRef = el)}
                            onChange={value => {
                                this.setState({
                                    company: value,
                                });
                            }}
                            placeholder="填写工作单位"
                        >
                            工作单位
                        </InputItem>
                        <TouchableOpacity onPress={() => {
                            this.selectBelief()
                        }}>
                            <InputItem
                                textAlign='end'
                                style={[styles.InputItemStyle]}
                                value={this.state.post}
                                ref={el => (this.inputRef = el)}
                                onChange={value => {
                                    this.setState({
                                        post: value,
                                    });
                                }}
                                placeholder="填写公司职位"
                            >
                                公司职位
                            </InputItem>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.selectWorkSort()
                        }}>
                            <InputItem
                                textAlign='end'
                                value={this.state.work_sort}
                                style={styles.InputItemStyle}
                                editable={false}
                                placeholder="单位性质"
                                extra={rightIcon}
                            >
                                单位性质
                            </InputItem>
                        </TouchableOpacity>
                        <Picker
                            data={this.state.industries}
                            cols={2}
                            value={this.state.value}
                            itemStyle={styles.picker}
                            onOk={value => {
                                console.log(value, 'sa')
                                this.setState({
                                    industry: value[0],
                                    industry_sub: value[1]
                                });
                            }}
                        >
                            <TouchableOpacity onPress={() => {
                            }}>
                                <InputItem
                                    textAlign='end'
                                    value={`${this.state.industry}-${this.state.industry_sub}`}
                                    style={styles.InputItemStyle}
                                    editable={false}
                                    placeholder="请选择"
                                    extra={rightIcon}
                                >
                                    行业
                                </InputItem>
                            </TouchableOpacity>
                        </Picker>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                textType : 'introduce'
                            }),
                            this.drawer && this.drawer.openDrawer()
                        }}>
                            <InputItem
                                textAlign='end'
                                value={this.state.ideal_mate+'...'}
                                style={styles.InputItemStyle}
                                editable={false}
                                placeholder="个人介绍"
                                maxLength={12}
                                extra={rightIcon}
                            >
                                个人介绍
                            </InputItem>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                textType : 'object'
                            }),
                            this.drawer && this.drawer.openDrawer()
                        }}>
                            <InputItem
                                textAlign='end'
                                value={this.state.introduction+'...'}
                                style={styles.InputItemStyle}
                                editable={false}
                                placeholder="理想对象"
                                maxLength={12}
                                extra={rightIcon}
                            >
                                理想对象
                            </InputItem>
                        </TouchableOpacity>
                    </List>
                </View>
            </View>
        )
    }

    renderBtn() {
        return (
            <View>
                <View style={{height: 32}}></View>
                <TouchableOpacity onPress={() => {
                    this.login()
                }}>
                    <View style={styles.btnStyle}>
                        <Text style={styles.textStyle}>保存资料</Text>
                    </View>
                </TouchableOpacity>
                <View style={{height: 62}}></View>
            </View>
        )
    }

    render() {
        return (
            <Drawer
                sidebar={this.renderSidebar()}
                position="right"
                open={false}
                drawerRef={el => (this.drawer = el)}
                onOpenChange={this.onOpenChange}
                drawerBackgroundColor="#fff"
                open={this.state.visible}
                drawerWidth={width}
            >
                <View style={{backgroundColor: "#fff", height: height,}}>
                    {/*<Basics></Basics>*/}
                    <Provider>
                        <CommonAvatar ref='app' getImagePath={this.getImagePath.bind(this)}></CommonAvatar>
                        <ScrollView
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersistTaps='always'>
                            {/*状态栏*/}
                            <StatusBar translucent={false} backgroundColor='#cd274e' barStyle="light-content"/>
                            {/*头像*/}
                            {this.renderAvatar()}
                            {/*基本信息*/}
                            {this.renderBasice()}
                            {/*详细信息*/}
                            {this.renderUserData()}
                            {/*保存按钮*/}
                            {this.renderBtn()}
                        </ScrollView>
                    </Provider>
                </View>
            </Drawer>

        );
    }
}
const {width, height, scale} = Dimensions.get('window');
const styles = StyleSheet.create({
    line: {
        height: 12,
        width: width,
        backgroundColor: '#f6f6f6',
        marginBottom: 10
    },
    touchConainer: {
        backgroundColor: '#fff',
        alignSelf: 'center',
        shadowColor: '#000000'
    },
    box: {},
    InputItemStyle: {
        fontSize: 16,
        textAlign: 'right',
        color: '#666666'
    },
    picker: {
        padding: 10,
        fontSize: 18
    },
    textInput: {
        padding: 0,
        textAlign: 'right',
        color: '#666',
        marginTop: -2,
        marginLeft: 32,
        fontSize: 16,
    },
    DatePickerBox: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    DatePickerText: {
        fontSize: 16,
        marginTop: 10,
        marginLeft: 15,
    },
    dateStyle: {
        width: 120,
        borderColor: '#fff',
        marginRight: width * .038
    },

    backPic: {
        height: 180,
    },
    uploadIcon: {
        width: 86,
        height: 86,
        borderRadius: 50,
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        marginTop: -46,
        zIndex: 1000,
    },
    listItem: {
        marginTop: 18,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    textStyle: {
        width: 200,
        textAlign: 'center',
        justifyContent: 'center',
        margin: 5,
        color: '#fff',
        fontSize: 14,
    },
    btnStyle: {
        width: 160,
        backgroundColor: '#D92553',
        alignSelf: 'center',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
        padding: 4,
        borderRadius: 4,
    },
    icon: {
        width: 16,
        height: 16,
    }
});
