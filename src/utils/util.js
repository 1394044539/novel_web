import { message,notification,Modal  } from 'ant-design-vue';
import { QuestionCircleOutlined,InfoCircleOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
const util={}

util.success = function (msg,duration=3) {
    return message.success(msg,duration)
}

util.error = function (msg,duration=3) {
    return message.error(msg,duration)
}

util.info = function (msg,duration=3) {
    return message.info(msg,duration)
}

/**
 * 此方法会返回一个hide，需要调用setTimeout(hide, 2500)来停止loading，2500指时间，可以是0，代表立马停止
 * 也可以传入一个时间，然后返回一个hide，调用then方法，让他继续向后执行
 * @param msg
 * @param duration
 * @returns {*}
 */
util.loading = function (msg,duration=0) {
    return message.loading(msg,duration)
}

util.successKey = function (content,duration=3,key) {
    return message.success({
        content,
        duration,
        key
    })
}

util.errorKey = function (content,duration=3,key) {
    return message.error({
        content,
        duration,
        key
    })
}

util.loadingKey = function (msg,duration=0,key) {
    return message.loading({
        content,
        duration,
        key
    })
}

util.noticeSuccess = function (message='成功',description='操作成功',duration=4.5) {
    notification.success({
        message,
        description,
        duration,
    })
}

util.noticeError = function (message='错误',description='操作失败',duration=4.5) {
    notification.error({
        message,
        description,
        duration,
    })
}

util.noticeInfo = function (message='提示',description='提示',duration=4.5) {
    notification.info({
        message,
        description,
        duration,
    })
}

util.noticeWarning = function (message='警告',description='警告',duration=4.5) {
    notification.warning({
        message,
        description,
        duration,
    })
}

/**
 * 问号提示框
 */
util.confirm = function (title="确认",content,recall) {
    //改成问号
     return  Modal.confirm({
         title,
         content,
         okText: '确认',
         cancelText: '取消',
         icon:createVNode(QuestionCircleOutlined),
         onOk(){
             recall()
         }
     });

}

/**
 * 成功提示框，去掉取消按钮
 */
util.confirmSuccess = function(title="成功",content,okText="确定"){
    //绿色对号
    Modal.info({
        title,
        content,
        okText
    })
}

/**
 * 黄色感叹号，改成红色感叹号
 */
util.confirmWaning = function(title="警告",content,okText="确定"){
    Modal.error({
        title,
        content,
        okText,
        icon:createVNode(InfoCircleOutlined)})
}
/**
 * 错误确认框
 */
util.confirmError = function(title="失败",content,okText="确定"){
    //红色错误
    Modal.error({
        title,
        content,
        okText,
        okType:'info'
    })
}

// //蓝色感叹号
// Modal.success({title: 'Confirm',content: 'Bla bla ...',})
// //无图标
// Modal.warning({title: 'Confirm',content: 'Bla bla ...',})


export default util
