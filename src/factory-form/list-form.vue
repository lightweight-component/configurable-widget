<template>
  <div>
   <FastTable widget-name="表单" :list-api-url="API" :columns-def="list.columns" />

    <Modal v-model="isShowEdit" title="预览" width="1300" ok-text="关闭" cancel-text="">
     <!--  <ListFactory ref="WidgetFactory" :api-root="apiRoot" :api="api" /> -->
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
            API: this.api || `${window.config.dsApiRoot}/common_api/widget_config/page?q_type=FORM`,
            listParams: 'q_type=LIST',
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
                    {
                        title: '接口地址', minWidth: 230, render: (h: Function, params: any) => h('span', params.row.config.dataBinding.url),
                        ellipsis: true, tooltip: true
                    },
                    List.createDate,
                    // List.status,
                    { title: '操作', slot: 'action', align: 'center', width: 260 }
                ]
            }
        };
    },

    mounted():void {
        // this.getData();
    },

    methods: {
        /**
         * 预览
         * 
         * @param id 
         */
        openDemo(id: number): void { // 直接调用，不另外新建一套预览。内部逻辑复杂
            this.$refs.WidgetFactory.id = id;
            this.$refs.WidgetFactory.getData(() => this.$refs.WidgetFactory.doRenderer());
        },
    },
};
</script>