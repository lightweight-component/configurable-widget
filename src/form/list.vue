<template>
  <div>
    <FastTable widget-name="表单定义" :list-api-url="API" :columns-def="list.columns" create-route="form-info" edit-route="form-info">
      <template v-slot:list_action="item">
        <a @click="openDemo(item.item)">预览</a>
        <Divider type="vertical" />
      </template>
    </FastTable>

    <Modal v-model="perview.isShow" title="预览" width="1200" ok-text="关闭" cancel-text="">
      <FormLoader ref="preview" />
    </Modal>
  </div>
</template>

<script lang="ts">
import FastTable from "../widget/fast-iview-table.vue";
import List from "@ajaxjs/ui/dist/iView-ext/fast-iview-table/list";
import FormLoader from "./form-loader.vue";
import { dateFormat } from '@ajaxjs/util/dist/util/utils';

/**
 * 管理界面列表
 */
export default {
  components: { FastTable, FormLoader },
  data() {
    return {
      perview: { isShow: false, title: "", data: {} },
      // @ts-ignore
      API: this.api || `${window.config.dsApiRoot}/common_api/widget_config/page?q_type=FORM_DEF`,
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
            title: "关联数据库",
            render(h: Function, params: any) {
              if (params.row.datasourceName)
                return h(
                  "span",
                  params.row.datasourceName + "/" + params.row.tableName
                );
              else return h("span", params.row.tableName);
            },
            width: 280,
            ellipsis: true,
          },
          {
              title: "修改日期",
              width: 160,
              align: "center",
              render(h: Function, params: any) {
                return h("div", dateFormat.call( new Date(params.row.updateDate), "yyyy-MM-dd hh:mm"));
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
      this.$refs.preview.formId = item.id;
      this.$refs.preview.load();
      this.perview.isShow = true;
    },
  },
};
</script>