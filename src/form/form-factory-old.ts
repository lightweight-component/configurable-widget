// import MoreAttrib from './form-more-attrib.vue';
// import FromRenderer from '../renderer/form-factory-renderer.vue';
// import FormPerviewLoader from '../loader/loader.vue';
import ConfigTable from '../../widget/config-table.vue';
// import ConfigPanel from './form-config.vue';
import InfoMixins from '../../common/info-common';
import { xhr_get } from '@ajaxjs/util/dist/util/xhr';

export default {
    components: { ConfigTable },
    mixins: [InfoMixins],
    methods: {
        /**
         * 新增l
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
         * 预览
         */
        doRenderer(): void {
            this.$refs.FormPerviewLoader.cfg = this.cfg;
            this.$refs.FormPerviewLoader.isShow = true;
        },

        /**
         * 数据库字段转换为表单配置
         */
        fieldsToCfg(selected: SelectedTable): void {
            if (selected && selected.fields && selected.fields.length) {
                this.cfg.fields = [];
                this.tableName = selected.tableName;
                this.datasourceId = selected.datasourceId;
                this.datasourceName = selected.datasourceName;
                selected.fields.forEach((item: CheckableDataBaseColumnMeta) => toCfg(item, this.cfg.fields));
            } else
                this.$Message.warning('未选择任何字段');
        },

        /**
         * 下载 JSON
         */
        downloadJson(): void {
            xhr_get(this.cfg.dataBinding.url, (j: RepsonseResult) => {
                this.jsonBased.jsonStr = JSON.stringify(j, null, 2);
            });
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
};

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