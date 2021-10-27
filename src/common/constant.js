import {useStore} from 'vuex'

let method = {
    getMenuValue(key) {
        return date.menuMap.get(key)
    },
    getMenu() {
        let roleList = useStore().state.roleList
        if(!roleList){
            return []
        }
        return this.recursionMenu(date.menu,roleList)
    },
    recursionMenu(menus,roleList){
        let reMenu = []
        menus.forEach(m => {
            //判断权限
            if (!m.role || method.intersect(m.role, roleList).length > 0) {
                if(m.children){
                    m.children = method.recursionMenu(m.children,roleList)
                }
                reMenu.push(m)
            }
        })
        return reMenu
    },
    intersect(set1, set2) {
        let a = new Set(set1);
        return set2.filter(x => a.has(x.roleCode));
    },
}

let date = {
    menu: [
        {
            key: 'Novel',
            title: '小说模块',
            icon: 'BookOutlined',
            children: [
                {
                    key: 'MyNovel',
                    title: '我的书架',
                },
                {
                    key: 'NovelManager',
                    title: '小说管理',
                },
                {
                    key: 'UploadRecord',
                    title: '上传记录',
                },
                {
                    key: 'MarkList',
                    title: '书签列表',
                },
                {
                    key: 'HistoryRecord',
                    title: '历史记录',
                },
            ]
        },
        {
            key: 'UserCenter',
            title: '个人中心',
            icon: 'UserOutlined',
            children: [
                {
                    key: 'DynamicInfo',
                    title: '动态信息',
                },
            ]
        },
        {
            key: 'UserSetting',
            title: '个人设置',
            icon: 'SettingOutlined',
            children: [
                {
                    key: 'InfoSetting',
                    title: '信息设置'
                },
                {
                    key: 'SafeSetting',
                    title: '安全设置'
                }
            ]
        },
        {
            key: 'SystemSetting',
            title: '系统设置',
            icon: 'SettingOutlined',
            role: ['SUPER_ADMIN'],
            children: [
                {
                    key: 'AdminCenter',
                    title: '管理员中心'
                }
            ]
        }
    ],
    menuMap: new Map([
        ['Novel', '小说模块'],
        ['MyNovel', '我的书架'],
        ['NovelManager', '小说管理'],
        ['UploadRecord', '上传记录'],
        ['MarkList', '书签列表'],
        ['HistoryRecord', '历史记录'],
        ['UserCenter', '个人中心'],
        ['DynamicInfo', '动态信息'],
        ['UserSetting', '个人设置'],
        ['InfoSetting', '信息设置'],
        ['SafeSetting', '安全设置'],
        ['SystemSetting', '系统设置'],
        ['AdminCenter', '管理员中心'],
    ]),
}

export default {method}