<template>
  <FormItem :label="item.label">
    <!--      <Row>
        <Col span="18"> -->
    <!-- 查看模式（只读） -->
    <span v-if="status === 0">
      <span v-if="item.uiType == 8" v-html="data[item.name]" class="html-content"></span>
      <!-- <span v-else-if="age<40">中年</span> -->
      <span v-else>{{data[item.name]}}</span>
    </span>

    <!-- 可写模式 -->
    <span v-if="status !== 0">
      <Input v-if="item.uiType == 1" type="text" v-model="data[item.name]" :placeholder="item.comment" />

      <Input v-if="item.uiType == 6" type="textarea" v-model="data[item.name]" :placeholder="item.comment" />

      <HtmlEditor v-if="item.uiType == 8" :v-model="data[item.name]" @on-change="data[item.name] = $event" :is-ionicons="true" style="height:360px;"></HtmlEditor>

      <Input v-if="item.uiType == 11" type="number" v-model="data[item.name]" :placeholder="item.comment" />
      <Input v-if="item.uiType == 18" type="password" v-model="data[item.name]" :placeholder="item.comment" />
      <Input v-if="item.uiType == 12" type="email" v-model="data[item.name]" :placeholder="item.comment" />

      <DatePicker v-if="item.uiType == 5" type="date" v-model="data[item.name]" placeholder="选择日期" style="width: 200px"></DatePicker>

      <Slider v-if="item.uiType == 10" v-model="value2" range />

      <span v-if="item.uiType == 7">
        <i-Switch v-model="data[item.name]" size="middle" /> &nbsp;
        <Tooltip v-if="item.comment" :content="item.comment" placement="right"><i class="ivu-icon ivu-icon-ios-help-circle-outline" /></Tooltip>
      </span>

      <Select v-if="item.uiType == 2 && item.ext_attribs" v-model="data[item.name]">
        <Option v-for="(item, index) in item.ext_attribs.candidateData" :key="index" :value="item.value">{{item.name}}</Option>
      </Select>

      <RadioGroup v-if="item.uiType == 3 && item.ext_attribs" v-model="data[item.name]">
        <Radio v-for="(item, index) in item.ext_attribs.candidateData" :key="index" :label="item.value">
          <span>{{item.name}}</span>
        </Radio>
      </RadioGroup>

      <RadioGroup v-if="item.uiType == 15" v-model="data[item.name]">
        <Radio label="1">
          <span>男</span>
        </Radio>
        <Radio label="2">
          <span>女</span>
        </Radio>
        <Radio label="0">
          <span>未知</span>
        </Radio>
      </RadioGroup>

      <RadioGroup v-if="item.uiType == 19" v-model="data[item.name]">
        <Radio :label="-1">
          <span>草稿</span>
        </Radio>
        <Radio :label="0">
          <span>正常</span>
        </Radio>
        <Radio :label="1">
          <span>已删除</span>
        </Radio>
        <Radio :label="2">
          <span>已禁用</span>
        </Radio>
      </RadioGroup>

      <span v-if="item.uiType == 20">{{data[item.name] | formatDate}}</span>
      <span v-if="item.uiType == 21">{{data[item.name] | formatDateLong}}</span>

      <CheckboxGroup v-if="item.uiType == 4 && item.ext_attribs" v-model="data[item.name]">
        <Checkbox v-for="(item, index) in item.ext_attribs.candidateData" :key="index" :label="item.value">{{item.name}}</Checkbox>
      </CheckboxGroup>
    </span>
    <!--    </Col> <Col span="4" offset="1">
         <Button @click="handleRemove(index)">Delete</Button> 
        </Col> -->
    <!--      </Row> -->
  </FormItem>
</template>

<script>
// import HtmlEditor from "@ajaxjs/util/dist/widget/HtmlEditor/HtmlEditor";

export default {
  // components: { HtmlEditor },
  props: {
    item: { type: Object },
    data: Object,
    status: Number,
  },
};
</script>