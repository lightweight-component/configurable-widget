<template>
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
      <Button size="small" @click="$refs.SelectForm.isShowListModal = true">选择表单</Button>
    </FormItem>

    <FormItem label="分页">
      <Checkbox v-model="listCfg.isPage">是否分页
        <i class="ivu-icon ivu-icon-ios-help-circle-outline" title="不分页则一次性查询所有数据，适合数据量较少的列表"></i>
      </Checkbox>
      分页参数：
      <RadioGroup v-model="listCfg.page">
        <Radio :label="1" :disabled="!listCfg.isPage">start/limit</Radio>
        <Radio :label="2" :disabled="!listCfg.isPage">pageNo/pageSize</Radio>
      </RadioGroup>
    </FormItem>

    <!-- 选择哪张表单绑定 -->
    <ListSelector ref="SelectForm" title="表单配置" :API="apiRoot + '/common_api/widget_config/list?q_type=LIST'" @on-select="onFormSelected($event)" :columns="formSelectorCols" />

    <FormPerviewLoader ref="FormPerviewLoader" />
  </Form>
</template>

<script lang="ts" src="./list-config.ts"></script>