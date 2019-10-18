import AsyncStorage from '@react-native-community/async-storage';

export default class DeviceStorage {
    static get(key) {
        return AsyncStorage.getItem(key).then((value) => {
            const jsonValue = JSON.parse(value);
            return jsonValue;
        });
    }

    static save(key, value) {
        return AsyncStorage.setItem(key, JSON.stringify(value));
    }

    static update(key, value) {
        return DeviceStorage.get(key).then((item) => {
            value = typeof value === 'string' ? value : Object.assign({}, item, value);
            return AsyncStorage.setItem(key, JSON.stringify(value));
        });
    }

    static delete(key) {
        return AsyncStorage.removeItem(key);
    }

}
    // 导入DeviceStorage.js
    // import DeviceStorage from './DeviceStorage';
    // 保存
    // DeviceStorage.save("tel","18911112222");
    // 获取
    // DeviceStorage.get('tel').then((tel)=>{
    //     if(tel == null || tel == ''){
    //
    //     } else {
    //         this.setState({
    //             tel:tel,
    //         });
    //     }
    // })
    // 更新
    // DeviceStorage.update("tel","17622223333");
    // 删除
    // DeviceStorage.delete("tel");
