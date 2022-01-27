<template>
    <div>
        <a-modal
                v-model:visible="showCreateCatalog"
                :title="modalFlag==='create'?'创建目录':'编辑目录'"
                :footer="null"
                @cancel="closeForm"
                width="400px"
        >
            <div class="create-catalog-form">
                <a-input placeholder="输入文件夹名" allowClear v-model:value="inputCatalogName"></a-input>
                <div v-if="modalFlag==='create'" style="margin-top: 5px;color: gray;text-align: left">ps:会在当前目录下创建目录</div>
                <div class="create-catalog-form-btn">
                    <a-button @click="closeForm">取消</a-button>
                    <a-button type="primary" style="margin-left: 15px" @click="submitCatalog">确定</a-button>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script>
    import { reactive,toRefs,watch } from 'vue'
    import api from '../../api/api'
    import util from "../../utils/util"


    export default {
        name: "CreateCatalog",
        props:{
            showCreateCatalog:{
                default: false,
                type: Boolean,
            },
            modalFlag: String,
            choseCatalog:Object,
            nowCatalog: Object,
        },
        setup(props,content){
            const state = reactive({
                inputCatalogName: ''
            })
            watch(()=>props.showCreateCatalog,(newV,oldV)=>{
                if(newV && props.modalFlag==='edit'){
                    state.inputCatalogName = props.choseCatalog.catalogName
                }else {
                    state.inputCatalogName = ''
                }
            })
            const submitCatalog = () => {
                if(!state.inputCatalogName){
                    util.info("目录名不能为空！")
                    return
                }
                util.confirm(props.modalFlag==='create'?'添加':'修改',props.modalFlag==='create'?'是否添加新目录':'是否修改新目录',()=>{
                    let param={
                        catalogName: state.inputCatalogName,
                        parentId: props.nowCatalog.collectionId,
                        collectionType: '2' //文件夹
                    }
                    if(props.modalFlag==='create'){
                        api.novelApi.addCollection(param).then(res=>{
                            util.success("创建成功")
                            success()
                        })
                    }else {
                        param.collectionId = props.choseCatalog. collectionId
                        api.novelApi.updateCollection(param).then(res=>{
                            util.success("修改成功")
                            success()
                        })
                    }
                })
            }

            const closeForm = () => {
                content.emit("closeForm",false)
            }
            const success = () => {
                content.emit("success")
            }

            return{
                ...toRefs(state),
                closeForm,
                submitCatalog
            }
        }
    }
</script>

<style scoped>
    .create-catalog-form{
        text-align: center;
        padding: 0 15%;
    }

    .create-catalog-form-btn{
        margin-top: 20px;
    }
</style>