<template>
  <ListFactory />
</template>

<script>
import ListFactory from "../factory-list/list";

export default {
  components: {
    ListFactory
  },
  methods: {
    routeTo(route) {
      location.hash = "#/" + route;
    },
    open(route) {
      window.open("#/" + route);
    },
  },
};
</script>

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

.ivu-menu.ivu-menu-vertical.user {
  background: url(~@/assets/user.png) no-repeat 110px bottom;
  background-size: 72%;
}

.ivu-menu.ivu-menu-vertical.portal {
  background: url(~@/assets/portal.jpg) no-repeat 100px bottom;
  background-size: 92%;
}

.ivu-menu.ivu-menu-vertical.model {
  background: url(~@/assets/model.jpg) no-repeat 100px bottom;
  background-size: 68%;
}
</style>