/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Actions } from "react-native-router-flux";
import {
    Platform,
    StyleSheet,
    ScrollView,
    Text,
    View
} from 'react-native';
type Props = {};
export default class IOS extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <Text style={[styles.textTitle]} >深圳市友福同享信息科技有限公司福恋服务协议条款：</Text>
                    <Text style={styles.textItem} >一、遵守中华人民共和国法律法令和其他相关法规，不可发布破坏宪法和法律、法规的信息。</Text>
                    <Text style={styles.textItem} >二、不得在网上宣扬封建迷信、淫秽、色情、暴力、赌博等不正当行为。</Text>
                    <Text style={styles.textItem} >三、福恋共享平台（以下简称：本平台）是普世值观而开发的交友平台，请如实填写信息。</Text>
                    <Text style={styles.textItem} >四、本平台也联合具有相同价观的企业，团队和个人在平台提供各类服务，各人使用时，务必谨慎，特别是在约会时，应选择人多的公众场合，不要去电影院、KTV、郊外等光线较暗或能独处的地方。</Text>
                    <Text style={styles.textItem} >五、交友时务必查验对方的属灵生命，并请谨记，我们都是蒙恩的罪人，都不完全，交友务必谨慎！应尽量一起参加聚会或团契活动，互相多多了解。</Text>
                    <Text style={styles.textItem} >六、申请使用平台会员必须年满18周岁以上，向我们提供本人真实、正确、最新及完整的资料，随时更新登记资料,确保其有效性，使用本平台需要实名认证，认证会员须遵守阿里巴巴《云盾身份认证服务合同》。</Text>
                    <Text style={styles.textItem} > 七、若会员提供任何错误、不实或不完整的资料,或我们有理由怀疑资料为错误、不实或不完整及违反会员注册条款的,或我们有理由怀疑其会员资料、言行等令其他网友反感的,我们有权修改或删除会员的注册昵称、资料、交友圈等,或暂停或终止该会员的帐号。</Text>
                    <Text style={styles.textItem} >八、对于用户上传的照片、资料、证件等,我们已采用相关措施进行审核,但不保证其内容的正确性、合法性或可靠性,相关责任由上传上述内容的会员负责。</Text>
                    <Text style={styles.textItem} >九、会员以自己的独立判断从事与交友相关的行为,并独立承担可能产生的不利后果和责任,本平台不承担任何法律责任。</Text>
                    <Text style={styles.textItem} >十、在交往中，请不要涉及借贷、投资或金钱交易，若涉及则纯属个人行为，其损失本平台不承担任何法律责任。</Text>
                    <Text style={styles.textItem} >十一、本平台对所有会员自发组织的活动、自发成立的组织不负责任。</Text>
                    <Text style={styles.textItem} >十二、你在本平台所有的信息、资料，都将被保存。</Text>
                    <Text style={styles.textItem} >十三、 用户不得将福恋服务用作商业用途或非法目的。福恋服务仅供用户为本人觅寻婚姻恋爱对象或帮助他人觅寻婚姻恋爱对象，以及了解、购买、使用福恋科技其他服务或产品为目的的使用，不得用于非法目的；除非经我们书面授权，任何人不应将福恋提供之任何信息及服务用作任何商业目的。任何非法和/或未经授权而使用福恋信息、服务的行为，我们将采取适当法律措施以保护我们的权益。</Text>
                    <Text style={styles.textItem} >十四、禁止利用福恋制作、复制、发布、传播含有下列内容的信息：</Text>
                    <Text style={styles.textItem} >      A、违反宪法和法律的；</Text>
                    <Text style={styles.textItem} >      B、扰乱公共秩序，违反社会公德的；</Text>
                    <Text style={styles.textItem} >      C、危害网络安全的；</Text>
                    <Text style={styles.textItem} >      D、危害国家安全、荣誉和利益；</Text>
                    <Text style={styles.textItem} >      E、煽动颠覆国家政权，推翻社会主义制度的；</Text>
                    <Text style={styles.textItem} >      F、煽动分裂国家、破坏国家统一的的；</Text>
                    <Text style={styles.textItem} >      G、宣扬恐怖主义、极端主义的；</Text>
                    <Text style={styles.textItem} >      H、宣扬民族仇恨、民族歧视，破坏民族团结的；</Text>
                    <Text style={styles.textItem} >      I、破坏国家宗教政策，宣扬邪教和封建迷信的；</Text>
                    <Text style={styles.textItem} >      J、编造、传播虚假信息，扰乱经济秩序和社会秩序；</Text>
                    <Text style={styles.textItem} >      k、传播淫秽色情、赌博、暴力或者教唆犯罪的；</Text>
                    <Text style={styles.textItem} >      L、侮辱或者诽谤他人，侵害名誉、隐私、知识产权和其他合法权益等活动；</Text>
                    <Text style={styles.textItem} >      M、含有法律、行政法规禁止的其他内容的。</Text>
                    <Text style={styles.textItem} >十五、一旦您注册成为逑吧用户，则本协议立即生效，您和我们均开始受本协议所有条款之约束。</Text>
                    <Text style={styles.textItem} >十六、本注册条款的最终解释权和修改权归本平台所有。</Text>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: '#F5FCFF',
        padding: 12,
    },
    textTitle: {
        fontSize: 16,
        // color: '#666666'
    },
    textItem: {
        fontSize: 14,
        marginTop: 12,
        color: '#666666',
        lineHeight: 22
    }
});
