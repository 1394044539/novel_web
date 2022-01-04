<template>
  <div>
    <a-modal
      v-model:visible="showTree"
      :title="treeType === 'copy' ? '复制' : '移动'"
      :footer="null"
      destroyOnClose
      @cancel="closeForm"
      width="400px"
    >
        <p>将
            {{collectionInfo.collectionType==='2'?'文件夹':collectionInfo.collectionType==='1'?'系列':'小说'}}
            【{{collectionInfo.catalogName}}】
            {{treeType === 'copy' ? '复制' : '移动'}}到
        </p>
        <a-tree 
        v-model:expandedKeys="expandedKeys"
        v-model:selectedKeys="selectedKeys"
        :load-data="onLoadData" 
        :tree-data="treeData" 
        @select="select"
        />
        <div style="text-align: right">
            <a-button @click="submit">确认</a-button>
        </div>
    </a-modal>
  </div>
</template>

<script>
import { reactive, toRefs, watch } from "vue";
import util from "../../utils/util";
import api from "../../api/api";

export default {
  name: "CatalogTree",
  props: {
    showTree: {
      type: Boolean,
      default: false,
    },
    treeType: String,
    collectionInfo: Object,
  },
  setup(props, content) {
    const state = reactive({
      treeData: [
          {
              key: '',
              title: '收藏列表',
          }
      ],
      expandedKeys: [],
      selectedKeys: [],
      selectedTree: {},
    });

    watch(() => props.showTree,(newV, oldV) => {
        if (newV) {
            state.expandedKeys= ['']
        }else{
            state.treeData = [{
                    key: '',
                    title: '收藏列表',
                    child: [],
            }]
            state.selectedKeys= []
            state.expandedKeys= []
            state.selectedTree= {}
        }
      }
    );

    //加载树组件
    const onLoadData = (treeNode) => {
        return new Promise(resolve => {    
            if (treeNode.dataRef.children) {
                resolve();
                return;
            }
            let param = {
                parentId: treeNode.dataRef.key,
                typeList: ["2"],
            };
            api.novelApi.getCollectionList(param).then((res) => {
                if(props.treeType === 'move'){
                    res = res.filter(e=>e.collectionId!==props.collectionInfo.collectionId)
                }
                treeNode.dataRef.children = res.map(e=>{return {key:e.collectionId,title:e.catalogName}})
                resolve();
            });
        })
    };
    const submit = () => {
        let tilte = props.treeType === 'copy' ? "复制":"移动"
        if(state.selectedKeys.length===0){
            util.info("请选择目标文件夹")
            return
        }else if(state.selectedTree.key===props.collectionInfo.collectionId){
            util.info("不允许往自身"+tilte)
            return
        }
        let msg = `是否要将${props.collectionInfo.catalogName}${tilte}到${state.selectedTree.title}`
        util.confirm(tilte+"到",msg,()=>{
            let param = {
                optType: props.treeType,
                collectionId: props.collectionInfo.collectionId,
                collectionType: props.collectionInfo.collectionType,
                parentId: state.selectedTree.key,
            }
            api.novelApi.copyOrMove(param).then(res=>{
              util.success(tilte+"成功！")
              content.emit("successCall",true)
            })
        })
    }
    const select = (selectedKeys,e) => {
        state.selectedTree = e.node.dataRef
    }

    const successCall = () => {
      content.emit("successCall");
    };
    const closeForm = () => {
      content.emit("closeForm", false);
    };
    return {
      ...toRefs(state),
      closeForm,
      onLoadData,
      select,
      submit,
    };
  },
};
</script>

<style scoped>
</style>
