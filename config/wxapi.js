import * as WeChat from "react-native-wechat";
import {Toast} from "@ant-design/react-native";

export default class WX {
    static pay(config) {
        console.log(config)
        return WeChat.isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    WeChat.pay({
                        partnerId: 'xxxxxx',  // 商家向财付通申请的商家id
                        prepayId: 'xxxxxx',   // 预支付订单
                        nonceStr: 'xxxxxx',   // 随机串，防重发
                        timeStamp: 'xxxxxxx',  // 时间戳，防重发.
                        package: 'Sign=WXPay',    // 商家根据财付通文档填写的数据和签名
                        sign: 'xxxxxxxxx'       // 商家根据微信开放平台文档对数据做的签名
                    }).then((requestJson) => {
                        //支付成功回调
                        if (requestJson.errCode == "0") {
                            //回调成功处理
                        }
                    }).catch((err) => {
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
