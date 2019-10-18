import Picker from 'react-native-picker';

export default class Pickers {
    static show(data, selectValue, ConfirmFn) {
        console.log(selectValue)
        Picker.init({
            pickerData: data, // 数据
            selectedValue: [selectValue], // 默认选项
            pickerTitleText: '',
            pickerConfirmBtnText: '选择',
            pickerCancelBtnText: '取消',
            pickerConfirmBtnColor: [255, 255, 255, 1],
            pickerCancelBtnColor: [255, 255, 255, 1],
            pickerToolBarBg: [217, 39, 84, 1],
            pickerBg: [255, 255, 255, 1],
            onPickerConfirm: data => {
                ConfirmFn(data)
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: data => {
                console.log(data);
            }
        });
        Picker.show();
    }

    static hide() {
        Picker.hide();
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
