import ListRenderer from './renderer/list-factory-renderer.vue';
import Fields2Cfg from './renderer/fields-to-cfg';
import CellRender from './renderer/list-cell-render';
import MoreAttrib from './list-more-attrib.vue';
import ListSelector from "./list-selector.vue";
// import FormFactoryMethod from "../factory-form/edit/form-factory.vue";
import ConfigTable from '../widget/config-table.vue';
import InfoMixins from '../widget/factory-info-common';
import FastTable from '../widget/fast-iview-table.vue';

/**
 * 内页
 */
export default {
    components: { ListRenderer, ConfigTable, MoreAttrib, ListSelector, FastTable },
    mixins: [InfoMixins],
    data(): {} {
        let self: any = this;

        return {
            // @ts-ignore
            API: this.api || `${config.dsApiRoot}/common_api/widget_config`,
            isShowPerview: false,
            initTableData: [], // 预览用的表格数据
            rendererColDef: [] as iViewTableColumn[], // 渲染器的列定义
            selectedTable: {} as SelectedTable,
            searchFields: [],
            cfg: {
                isPage: true,
                page: 2,
                dataBinding: {
                    httpMethod: 'GET',
                    url: "",
                    beforeRequest: '',
                    baseParams: ''
                },
                fields: [], // 列配置
                toolbarButtons: [],
                actionButtons: [],
                bindingForm: { id: 0, name: '' }
            } as ListFactory_ListConfig,

            listDef: {
                page: 1
            } as ListFactory_ListConfig_New,
            formSelectorCols: [
                { key: "id", title: "#", width: 60 },
                { key: "name", title: "名称", minWidth: 80 },
                { key: "tableName", title: "表名", minWidth: 70 },
                {
                    key: "apiUrl",
                    title: "接口地址",
                    minWidth: 260,
                    ellipsis: true,
                    tooltip: true,
                },
                {
                    title: "预览",
                    width: 70,
                    render(h: Function, params: any) {
                        return h(
                            "a",
                            {
                                on: {
                                    click: (event: Event) => {
                                        let FormPerviewLoader = self.$refs.FormPerviewLoader;
                                        debugger;
                                        // @ts-ignore
                                        FormPerviewLoader.cfg = FormFactoryMethod.methods.copyValue(
                                            {},
                                            params.row
                                        ); // 数据库记录转换到 配置对象;
                                        FormPerviewLoader.isShow = true;
                                    },
                                },
                            },
                            "预览"
                        );
                    },
                },
            ],
        }
    },

    methods: {
        /**
         * 获取单个数据
         */
        getData(): void {
            let _cb: Function = (r: any) => this.listDef = r.config;

            this.getDataBase(_cb);
        },

        save(): void {
            this.saveOrUpdate(this.listDef, 'LIST_DEF');
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
            let lastRow: BaseCol = this.cfg.fields[this.cfg.fields.length - 1];

            if (!lastRow.key || !lastRow.title) {
                this.$Message.error('请填写完整内容');
                return;
            }

            this.editIndex = -1;
        },

        /**
         * 数据库字段转换为表格列配置
         */
        fieldsToCfg(selected: SelectedTable): void {
            this.selectedTable = selected;

            let listCfg: ListFactory_ListConfig = this.cfg;
            if (selected && selected.fields && selected.fields.length) {
                listCfg.fields = [];
                this.datasourceId = selected.datasourceId;
                this.datasourceName = selected.datasourceName;
                this.tableName = selected.tableName;

                selected.fields.forEach((item: CheckableDataBaseColumnMeta) => Fields2Cfg(item, listCfg.fields));
            } else
                this.$Message.warning('未选择任何字段');
        },

        /**
         * 转换为 Table 的配置
         */
        doRenderer(): void {
            this.isShowPerview = true;
            this.rendererColDef = [];

            if (this.initTableData.length)
                this.initTableData = [];

            let listCfg: ListFactory_ListConfig_New = this.listDef;
            let fields: TableColumn[] = listCfg.colConfig;

            fields.forEach((item: TableColumn) => { // 转换为 iView 的配置
                if (item.isShow) {
                    let rendererColDef: iViewTableColumn = { title: item.title, key: item.key, width: item.width, minWidth: item.minWidth, align: item.align };
                    CellRender(rendererColDef, item);
                    this.rendererColDef.push(rendererColDef);
                }
            });

            this.$refs.renderer.list.pageNo = 1; // 复位分页
            this.$refs.renderer.getData(); // 手动加载数据
        },

        /**
         * 显示表单配置
         *
         * @returns
         */
        getFormConfig(): string {
            let cfg: ListFactory_ListConfig_New = this.listDef;

            if (cfg && cfg.bindingFormId)
                return (cfg.bindingFormId || "") + "#" + (cfg.bindingFormName || '');
            else return "未绑定";
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
            this.$refs.listDefDemo.colDefId = this.id;
            this.isShowPerview = true;
        }
    }
}