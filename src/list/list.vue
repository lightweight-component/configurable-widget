<template>
  <div>
    <FastTable widget-name="列表定义" :list-api-url="initApi" :columns-def="list.columns" create-route="list-info" edit-route="list-info">
      <template v-slot:list_action="item">
        <a @click="openDemo(item.item)">预览</a>
        <Divider type="vertical" />
      </template>

      <!--         <template v-slot:toolbar>
            <div style="float:left;margin-right:10px;">
                <h2>Scoped slot with props</h2>
                <a>管理项目</a>
            </div>
        </template> -->
    </FastTable>

    <Modal v-model="perview.isShow" title="预览" width="1200" ok-text="关闭" cancel-text="">
      <ListLoader ref="listDefDemo" />
    </Modal>
  </div>
</template>

<script lang="ts">
import FastTable from "../widget/fast-iview-table.vue";
// @ts-ignore
//import FastTable from '@ajaxjs/ui/dist/iView-ext/fast-iview-table/fast-iview-table.vue';
import List from "@ajaxjs/ui/dist/iView-ext/fast-iview-table/list";
import ListLoader from "./list-loader.vue";
import { dateFormat } from "@ajaxjs/util/dist/util/utils";

/**
 * 管理界面列表
 */
export default {
  components: { FastTable, ListLoader },
  props: {
    initApi: { type: String, required: true },
  },
  data() {
    return {
      perview: { isShow: false, title: "", data: {} },
      list: {
        columns: [
          List.id,
          {
            title: "列表名称",
            key: "name",
            minWidth: 130,
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "关联表单",
            render(h: Function, params: any) {
              return h("span", params.row.config.bindingFormName);
              // if (params.row.datasourceName)
              //   return h("span",
              //     params.row.datasourceName + "/" + params.row.tableName
              //   );
              // else return h("span", params.row.tableName);
            },
            width: 180,
            ellipsis: true,
          },
          {
            title: "接口地址",
            minWidth: 250,
            render: (h: Function, params: any) =>
              h("span", params.row.config.httpApi),
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "修改日期",
            width: 160,
            align: "center",
            render(h: Function, params: any) {
              return h(
                "div",
                dateFormat.call(
                  new Date(params.row.updateDate),
                  "yyyy-MM-dd hh:mm"
                )
              );
            },
          },
          List.createDate,
          List.status,
          { title: "操作", slot: "action", align: "center", width: 260 },
        ],
      },
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
  },
};
</script>