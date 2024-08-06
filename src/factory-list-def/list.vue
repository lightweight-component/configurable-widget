<template>
  <div>
   <FastTable widget-name="列表定义" :list-api-url="API" :columns-def="list.columns" :on-create-btn="showCreate">
        <template v-slot:list_action="item">
            <a @click="openDemo(item.item)">预览</a> <Divider type="vertical" />
        </template>

<!--         <template v-slot:toolbar>
            <div style="float:left;margin-right:10px;">
                <h2>Scoped slot with props</h2>
                <a>管理项目</a>
            </div>
        </template> -->
   </FastTable>

    <Modal v-model="perview.isShow" title="预览" width="1300" ok-text="关闭" cancel-text="">
        <FastTable ref="listDefDemo" :is-remote-col-def="true" />
    </Modal>
  </div>
</template>

<script lang="ts">
import FastTable from '../widget/fast-iview-table.vue';
// @ts-ignore
//import FastTable from '@ajaxjs/ui/dist/iView-ext/fast-iview-table/fast-iview-table.vue';
import List from '@ajaxjs/ui/dist/iView-ext/fast-iview-table/list';
import CommonFactory from '../widget/factory-list-mixins';

/**
 * 管理界面列表
 */
export default {
    components: { FastTable },
    mixins: [CommonFactory],
    data() {
        return {
            // @ts-ignore
            API: this.api || `${window.config.dsApiRoot}/common_api/widget_config/page?q_type=LIST_DEF`,
            list: {
                columns: [
                    List.id,
                    { title: '列表名称', key: 'name', minWidth: 130, ellipsis: true, tooltip: true },
                    {
                        title: '关联数据库', render(h: Function, params: any) {
                            if (params.row.datasourceName)
                                return h('span', params.row.datasourceName + "/" + params.row.tableName);
                            else
                                return h('span', params.row.tableName);
                        }, width: 280, ellipsis: true
                    },
                    // {
                    //     title: '接口地址', minWidth: 230, render: (h: Function, params: any) => h('span', params.row.config.dataBinding.url),
                    //     ellipsis: true, tooltip: true
                    // },
                    List.createDate,
                    // List.status,
                    { title: '操作', slot: 'action', align: 'center', width: 260 }
                ]
            }
        };
    },

    methods: {
        /**
         * 预览
         * 
         * @param id 
         */
        openDemo(item: any): void { 
            this.$refs.listDefDemo.colDefId = item.id;
            this.perview.isShow = true;
        },
        showCreate(): void{
            this.$router.push({ path: 'factory-list-info-new'});
        }
    },
};
</script>