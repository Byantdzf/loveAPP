import * as WeChat from "react-native-wechat";
import {Toast} from "@ant-design/react-native";
export default class WX {
    static pay(config) {
        console.log(config,'asssss')
        WeChat.registerApp('wx2aa846fb62df72c9');
        return WeChat.isWXAppInstalled().then((isInstalled) => {
                if (isInstalled) {
                    console.log('装了微信')
                    WeChat.pay({
                        partnerId: config.partnerid,  // 商家向财付通申请的商家id
                        prepayId: config.prepayid,   // 预支付订单
                        nonceStr: config.noncestr,   // 随机串，防重发
                        timeStamp: config.timestamp,  // 时间戳，防重发.
                        package: config.package,    // 商家根据财付通文档填写的数据和签名
                        sign:  config.sign  // 商家根据微信开放平台文档对数据做的签名
                    }).then((requestJson) => {
                        console.log('12')

                        //支付成功回调
                        Toast.fail('唧唧');
                        if (requestJson.errCode == "0") {
                            Toast.success('支付成功');
                            //回调成功处理
                        }
                    }).catch((err) => {
                        console.log(err)
                        Toast.fail('请安装微信');
                    })
                } else {
                    Toast.fail('请安装微信');
                }
            });
    }
    static shareToTimeline(config) {
        console.log(config)
        return WeChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    WeChat.shareToTimeline({
                        title:'分享的标题',
                        description: '分享的标题内容',
                        thumbImage: '分享的标题图片',
                        type: 'news',
                        webpageUrl: '分享的链接'
                    })
                        .catch((error) => {
                            Toast.info(error.message);
                        });
                } else {
                    Toast.fail('请安装微信');
                }
            });
    }

}
