<template>
  <ConfigTable ref="configTable" class="list-factory" below-perview>
    <template slot="table-header">
      <div class="input-width">渲染器</div>
      <div class="align">对齐方式</div>
      <div class="number-width">最小列宽</div>
      <div class="number-width">列宽</div>
      <div class="number-width">最大列宽</div>
      <div class="checkbox-width">不换行</div>
      <!--       <div class="checkbox-width">可搜索</div> -->
      <div class="checkbox-width">可排序</div>
      <div class="checkbox-width">下拉筛选</div>
    </template>

    <template slot="table-fields" slot-scope="scope">
      <div class="input-width"><Input type="text" size="small" v-model="scope.item.key" /></div>
      <div class="input-width"><Input type="text" size="small" v-model="scope.item.title" /></div>

      <div class="input-width">
        <Select size="small" v-model="scope.item.render" transfer>
          <Option value="raw">原文输出</Option>
          <Option value="link">链接</Option>
          <Option value="link_http">显示地址的链接</Option>
          <Option value="email">电子邮件</Option>
          <Option value="thumb">缩略图</Option>
          <Option value="date">日期（不含时间）</Option>
          <Option value="long_date">长日期</Option>
          <Option value="short_date">短日期</Option>
          <Option value="sex">性别</Option>
          <Option value="stat">实体状态</Option>
          <Option value="render">自定义渲染函数</Option>
          <Option value="clk_event">自定义点击事件</Option>
        </Select>
      </div>

      <div class="align">
        <Select size="small" v-model="scope.item.align" transfer>
          <Option value="left">居左</Option>
          <Option value="center">居中</Option>
          <Option value="right">居右</Option>
        </Select>
      </div>

      <div class="number-width">
        <Input type="number" size="small" v-model="scope.item.minWidth" style="margin:0 auto" />
      </div>
      <div class="number-width">
        <Input type="number" size="small" v-model="scope.item.width" />
      </div>
      <div class="number-width">
        <Input type="number" size="small" v-model="scope.item.maxWidth" />
      </div>

      <div class="checkbox-width">
        <Checkbox v-model="scope.item.isOneLine" />
      </div>
      <!--       <div class="checkbox-width">
        <Checkbox v-model="scope.item.canSearch" />
      </div> -->
      <div class="checkbox-width">
        <Checkbox v-model="scope.item.sortable" />
      </div>
      <div class="checkbox-width">
        <Checkbox v-model="scope.item.canDropdownFilter" />
      </div>
    </template>

    <!--     <Modal v-model="isShowFormDesigner" width="1300" title="表单设计器">
      <FormDesigner :init-config-data="formConfigData()"></FormDesigner>
    </Modal> -->

    <template slot="config-panel">
      <!-- 详细配置 -->
      <Form :label-width="120" label-colon>
        <!--         <FormItem label="记录 id">{{$parent.id}}</FormItem>
          <Row>
            <Col span="12">
            <FormItem label="数据源">
              {{parent.datasourceName}}#{{parent.datasourceId}}
            </FormItem>
            </Col>
            <Col span="12"> 
            <FormItem label="绑定表名">
              {{parent.tableName}}
            </FormItem>
            </Col>
          </Row> -->

        <FormItem label="绑定的表单">{{getFormConfig()}}
          <Button size="small" @click="isShowListModal = true">选择表单</Button>
        </FormItem>

        <FormItem label="分页参数">
          <RadioGroup v-model="cfg.page">
            <Radio :label="0">不分页</Radio><i class="ivu-icon ivu-icon-ios-help-circle-outline" title="不分页则一次性查询所有数据，适合数据量较少的列表" />&nbsp;
            <Radio :label="1">start/limit</Radio>
            <Radio :label="2">pageNo/pageSize</Radio>
          </RadioGroup>
        </FormItem>

        <fieldset class="hr">
          <legend>API 接口</legend>
        </fieldset>

        <FormItem label="API 接口">
          <Input v-model="cfg.httpApi" placeholder="API 接口，{project_prefix} 表示项目前缀" style="width:70%" />
        </FormItem>

        <!-- 选择哪张表单绑定 -->
        <Modal v-model="isShowListModal" title="选择表单" ok-text="关闭" cancel-text="" width="800">
          <FormListSelector :pickup="true" ref="SelectForm" widget-name="表单配置" :list-api-url="formListApi" @on-select="onFormSelected($event)" :columns-def="formSelectorCols" />
        </Modal>

        <FormLoader ref="FormPerviewLoader" />
      </Form>
    </template>

    <template slot="live-perview">
      <ListLoader ref="LivePerview" :api-prefix="apiPrefix" :show-search="false" :modal-info="false" />
    </template>

    <Modal v-model="isShowPerview" title="预览" width="1200" ok-text="关闭" cancel-text="">
      <ListLoader ref="preview" :api-prefix="apiPrefix" />
    </Modal>

    <template slot="more-attrib" slot-scope="scope">
      <MoreAttrib :row="scope.row" />
    </template>
  </ConfigTable>
</template>

<script lang="ts" src="./info.ts"></script>

<style lang="less" scoped>
fieldset.hr {
  border: none;
  width: 90%;
  margin: 0 auto;
  border-top: 1px solid lightgray;

  legend {
    text-align: center;
    padding: 10px;
  }
}

fieldset.panel {
  margin-top: 20px;
  border: 1px solid lightgray;
  padding: 10px 20px;

  legend {
    text-align: center;
    letter-spacing: 5px;
  }
}

.list-factory {
  margin: 10px auto;

  .center input {
    text-align: center;
  }
}

li {
  .render {
    width: 120px;
  }
  .align {
    width: 90px;
  }
}

ul.custom {
  width: 380px;
  max-height: 400px;
  // margin: 30px 0;
  border: 1px solid lightgray;
  overflow-x: auto;
  li {
    list-style: none;
    padding: 3px;
    &:hover {
      color: black;
      .isChecked {
        a {
          display: inline;
        }
      }
    }

    & > div {
      display: inline-block;
      width: 33%;
      text-align: center;

      input {
        border: none;
        text-align: center;
        width: 90%;
        background-color: transparent;
        outline: none;
      }
    }

    &:nth-child(odd) {
      background-color: #f0f0f0;
    }

    .action a {
      // display: none;
      color: red;
    }
  }
  &.disabled {
    filter: grayscale(1) opacity(0.4);
  }
}
</style>