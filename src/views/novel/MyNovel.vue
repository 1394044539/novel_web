<template>
    <div>
        <div>

        </div>
        <div>
            <a-table :row-selection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange}"
                     :pagination="pagination" :columns="columns" :data-source="data" :scroll="{ x: 1500, y: 300 }">
            </a-table>
        </div>
    </div>
</template>

<script>
    import { reactive,toRefs,onMounted} from 'vue'

    export default {
        name: "MyNovel",
        setup(props, context) {
            const state = reactive({
                data: []
            })
            onMounted(()=>{

            })
            const columns = [
                {
                    title: '收藏名',
                    dataIndex: 'catalogName',
                    key: 'catalogName',
                    slots: {
                        customRender: 'catalogName'
                    }
                },
                {
                    title: '收藏类型',
                    dataIndex: 'collectionType',
                    key: 'collectionType',
                    slots: {
                        customRender: 'collectionType'
                    }
                },
                {
                    title: '父级目录',
                    dataIndex: 'parentId',
                    key: 'parentId',
                    slots: {
                        customRender: 'catalogName'
                    }
                },
                {
                    title: '操作',
                    key: 'operation',
                    slots: {
                        customRender: 'operation',
                    },
                }
            ]
            const pagination = {
                current: state.page,
                pageSize: state.pageSize,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],//每页中显示的数据
                showTotal: total => `共有 ${total} 条数据`,  //分页中显示总的数据
                onShowSizeChange: (current, pageSize) => {}, // 改变每页数量时更新显示
                onChange:(page,pageSize)=> {},//点击页码事件
            }
            const onSelectChange = (selectedRowKeys,selectedRows) => {
                state.selectedRowKeys = selectedRowKeys
                state.selectedRows = selectedRows
            }

            return {
                ...toRefs(state),
                columns,
                onSelectChange,
                pagination,
            }
        }
    }
</script>

<style scoped>

</style>