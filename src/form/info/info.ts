import FormLoader from "../form-loader.vue";
import MoreAttrib from './form-more-attrib.vue';
import ConfigPanel from './form-config.vue';
import ConfigTable from '../../widget/config-table.vue';
import InfoMixins from '../../widget/factory-info-common';
import FastTable from '../../widget/fast-iview-table.vue';

/**
 * 内页
 */
export default {
    components: { ConfigTable, MoreAttrib, FormLoader, FastTable, ConfigPanel },
    mixins: [InfoMixins],
    data(): {} {
        return {
            API: this.api || `${window['config'].dsApiRoot}/common_api/widget_config`,
            isShowPerview: false,
            cfg: {
                labelWidth: 80,
                dataBinding: {
                    httpMethod: 'GET',
                    url: "",
                    beforeRequest: '',
                    baseParams: ''
                },
                updateApi: {
                    httpMethod: 'POST',
                    url: "",
                    beforeRequest: '',
                    baseParams: ''
                },
                jsonBased: {
                    isJsonBased: false,
                    key: 'FOO',
                },
                isShowBtns: true,
                fields: []
            } as FormFactory_Config,
            extraDataOnSave: {},// 调用者额外想送入的数据
            list: {
                columns: [
                    { title: '显示', slot: 'isShow', align: 'center', width: 45 },
                    {
                        title: '字段 name', minWidth: 130, align: 'center', render: (h: Function, params: any) => {
                            return h('Input', {
                                props: { type: 'text', placeholder: 'name 必填', value: this.cfg.fields[params.index].name },
                                on: {
                                    'on-blur': (event: any) => {
                                        if (event.target.value)
                                            this.cfg.fields[params.index].name = event.target.value;
                                    },
                                },
                            });
                        }
                    },
                    { title: '名称 label', slot: 'uiLabel', align: 'center', minWidth: 130 },
                    { title: 'UI 类型', slot: 'uiType', align: 'center', width: 150 },
                    { title: 'UI 布局', slot: 'uiLayout', align: 'center', width: 80 },
                    { title: '数据类型', slot: 'dataType', align: 'center', width: 100 },
                    { title: '数据长度', slot: 'dataWidth', align: 'center', width: 80 },
                    { title: '必填', slot: 'isNull', align: 'center', width: 45 },
                    { title: '默认值', slot: 'defaultValue', align: 'center', minWidth: 130 },
                    // { title: '枚举值', slot: 'emuValue', align: 'center', width: 150 },
                    { title: '正则验证', slot: 'regexp', align: 'center', width: 150 },
                    { title: '验证提示', slot: 'validMsg', align: 'center', width: 150 },
                    { title: '操作', slot: 'action', align: 'center', minWidth: 100 }
                ]
            } as TableListConfig,
            view: 'model', // 视图 model | form
            jsonBased: {
                isShowJsonBased: false, // 从 JSON  新建
                jsonStr: `{
    "clientShortName": "TEST",
    "FOO": {
        "NUMBER": 1221,
        "STR": "BAR22",
        "BOOLEAN": true,
        "NULL": null,
        "ARRAY": [
            1,
            "STR",
            null
        ],
        "OBJ":{
            "ZXY": "DD"
        }
    }
}`,
            }
        };
    },

    methods: {
        /**
         * 获取单个数据
         */
        getData(): void {
            let _cb: Function = (r: any) => {
                this.cfg = r.config;

                if (this.cfg.jsonBased && this.cfg.jsonBased.isJsonBased)
                    this.view = 'form';
            }

            this.getDataBase(_cb);
        },

        save(): void {
            this.saveOrUpdate(this.cfg, 'FORM_DEF');
        },

        /**
         * 新增
         */
        addRow(): void {
            let row: FormFactory_ItemConfig = { isShow: true, name: '', label: '', uiType: 1, uiLayout: 1, jsonType: 'string', isNull: false };

            this.cfg.fields.push(row);
            this.editIndex = this.cfg.fields.length - 1;
        },

        /**
         * 保存新增
         */
        saveAddRow(): void {
            let lastRow: FormFactory_ItemConfig = this.cfg.fields[this.cfg.fields.length - 1];

            if (!lastRow.name || !lastRow.label) {
                this.$Message.error('请填写完整内容');
                return;
            }

            this.editIndex = -1;
        },


        /**
         * 选中表单配置之后
         *
         * @param formCfg
         */
        onFormSelected({ id, name }): void {
            this.$refs.SelectForm.isShowListModal = false;

            let cfg: ListFactory_ListConfig_New = this.listDef;
            cfg.bindingFormId = id;
            cfg.bindingFormName = name;

            this.$forceUpdate();
        },

        // @override
        emptyData(): void {
            this.name = '';
            this.listDef = { page: 1, colConfig: [] };
        },
        perview(): void {
            this.isShowPerview = true;
        },
        /**
         * 从 JSON 新建
         */
        parseJsonBased(): void {
            let json: any = JSON.parse(this.jsonBased.jsonStr);
            let jsonTarget: any = findNode(json, this.cfg.jsonBased.key.split('.'));

            for (let i in jsonTarget) {
                let item = jsonTarget[i];
                let uiType: number, jsonType: JsonType;

                switch (typeof item) {
                    case 'number':
                        jsonType = 'number';
                        uiType = 11;
                        break;
                    case 'boolean':
                        jsonType = 'boolean';
                        uiType = 3;
                        break;
                    case 'string':
                    default:
                        jsonType = 'string';
                        uiType = 1;
                }

                let col: FormFactory_ItemConfig & Model = {
                    isShow: true,
                    name: i,
                    label: '',
                    uiType: uiType,
                    uiLayout: 1,
                    jsonType: jsonType,
                    ext_attribs: {}
                };

                this.cfg.fields.push(col);
            }

            this.cfg.jsonBased.isJsonBased = true;
            this.view = 'form';
        }
    }
}

/**
 * 智能识别
 * 针对不同的字段类型，决定不同的表单配置
 * 都是一些常见的、约定成俗的配置
 * 
 * @param item 
 * @param tableColumnData 
 */
function toCfg(item: CheckableDataBaseColumnMeta, tableColumnData: FormFactory_ItemConfig[]): void {
    let col: FormFactory_ItemConfig & Model = {
        isShow: true,
        isKey: item.isKey,
        name: item.name,
        label: item.name,
        comment: item.comment,
        length: item.length,
        uiType: 1,
        uiLayout: 1,
        defaultValue: item.defaultValue
    };

    if (item.null === 'YES')
        col.isNull = true;
    else if (item.null === 'NO')
        col.isNull = false;

    let type: string = item.type.toLowerCase();
    if (type.indexOf('text') != -1)
        col.uiType = 6;

    if (type.indexOf('datetime') != -1)
        col.uiType = 6;

    let name: string = item.name.toLowerCase();

    // if (name.indexOf('thumb') != -1 || name.indexOf('avatar') != -1)
    //     col.render = 'thumb';

    // 名称
    switch (name) {
        case 'name':
            col.label = '名称';
            break;
        case 'content':
        case 'desc':
            col.label = '简介';
            col.uiType = 6;
            break;
        // case 'stat':
        //     col.title = '状态';
        //     col.width = 100;
        //     break;
        // case 'createDate':
        // case 'created_at':
        //     col.title = '创建日期';
        //     col.width = 160;
        //     break;
        // case 'updateDate':
        // case 'updated_at':
        //     col.title = '修改日t期';
        //     col.width = 160;
        //     break;
    }

    tableColumnData.push(col);
}

/**
 * 
 * @param obj 
 * @param queen 
 * @returns 
 */
export function findNode(obj: any, queen: string[]): any {
    if (!queen.shift)
        return null;

    let first: string = queen.shift();

    for (let i in obj) {
        if (i === first) {
            let target: any = obj[i];

            if (queen.length == 0) {
                // 找到了
                return target;
            } else {
                return findNode(obj[i], queen);
            }
        }
    }
}