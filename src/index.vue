<template>
  <Split v-model="split" style="border-top: 1px solid lightgray;">
    <div slot="left" class="split-pane-left">
      <leftTree ref="leftTreeCmp" />
    </div>

    <div slot="right" class="split-pane-right">
      <div class="header">
        <user />
        <h1 v-if="widgetType == 'listDef'">列表定义</h1>
        <h1 v-if="widgetType == 'formDef'">表单定义</h1>
      </div>

      <list v-if="widgetType == 'listDef'" />
      <Form v-if="widgetType == 'formDef'" />
      <project ref="project" />
    </div>
  </Split>
</template>

<script>
import List from "./list/list";
import Form from "./form/list";
import leftTree from "./tree/tree.vue";
import user from "@ajaxjs/ui/dist/iam/user.vue";
import aj from "@ajaxjs/ui/dist/";
import project from "./project/project.vue";

aj.IAM.getLoginInfo(window.config.loginUrl, window.config.thisPageUrl);

export default {
  components: {
    List,
    Form,
    leftTree,
    project,
    user,
  },
  data() {
    return {
      split: 0.16,
      widgetType: "listDef",
    };
  },
  methods: {
    openLeft(a, data) {
      switch (data.title) {
        case "表单定义":
          this.widgetType = "formDef";
          break;
        case "列表定义":
          this.widgetType = "listDef";
          break;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  line-height: 260%;
  padding-right: 30px;
  border-bottom: 1px solid #eee;

  & > a {
    float: right;
  }
  h1 {
    margin: 10px 30px;
    padding: 6px 0;
  }
}
</style>
<style lang="less">
.home h2,
.home p {
  max-width: 800px;
  margin: 10px auto;
}

html,
body,
.main > .ivu-menu {
  height: 100%;
}

/* 分页控件有点问题，修改下 */
.ivu-mt.ivu-text-right {
  text-align: right;
  margin-top: 20px;
}

h1.page-title {
  margin: 0 0 2% 1%;
  padding-bottom: 1%;
  border-bottom: 1px solid #eee;
  color: #2f518c;
  letter-spacing: 2px;
  height: 9%;
  line-height: 100px;
}

h3 {
  padding: 30px 22px;
  box-sizing: border-box;
  color: #2f518c;
  width: 100%;
  border-right: 1px solid lightgray;
  font-size: 1.3em;
  font-weight: bold;
  letter-spacing: 1px;
  height: 9%;
}

.ivu-menu-submenu-title {
  border-top: 1px solid #eee;
}
</style>