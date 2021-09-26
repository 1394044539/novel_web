let method = {
    getMenuValue(key){
        return menuMap.get(key)
    }
}

const menuMap = new Map([
    ['Novel','小说模块'],
    ['MyNovel','我的书架'],
    ['NovelManager','小说管理'],
    ['UploadRecord','上传记录'],
    ['MarkList','书签列表'],
    ['HistoryRecord','历史记录'],
    ['UserCenter','个人中心'],
    ['DynamicInfo','动态信息'],
    ['UserSetting','个人设置'],
    ['InfoSetting','信息设置'],
    ['SafeSetting','安全设置'],
    ['HistoryRecord','历史记录'],
    ['SystemSetting','系统设置'],
    ['AdminCenter','管理员中心'],
]);

export default { method }