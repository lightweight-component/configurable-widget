import ListRenderer from '../renderer/list-factory-renderer.vue';
import Fields2Cfg from '../renderer/fields-to-cfg';
import CellRender from '../renderer/list-cell-render';
import MoreAttrib from './list-more-attrib.vue';
// import Config from '../data-service/all-dml';
import ConfigTable from '../../widget/config-table.vue';
import InfoMixins from '../../widget/factory-info-common';
import ListSelector from "./list-selector.vue";
import FormPerviewLoader from "../../factory-form/loader/loader.vue";
import FormFactoryMethod from "../../factory-form/edit/form-factory.vue";

/**
 * 内页
 */
export default {
    components: { ListRenderer, ConfigTable, MoreAttrib, ListSelector, FormPerviewLoader },
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
        getData(cb?: Function): void {
            let _cb: Function = (r: any) => {
                this.cfg = r.config;
                setTimeout(() => cb && cb(), 100);
            };

            if (this.getDataBase)
                this.getDataBase(_cb);
            else
                InfoMixins.methods.getDataBase.call(this, _cb);
        },

        /**
         * 创建 api-> 持久化
         */
        save(): void {
            if (!this.name) {
                this.$Message.error('保存失败。请输入名称');
                return;
            }

            let def: ListFactory_ListConfig_New = {
                page: Paging.NO_PAGE
            };

            let record: ConfigurableWidgetPO = {
                name: this.name,
                config: JSON.stringify(def, null, 1),
                type: "LIST_DEF"
            };

            this.saveOrUpdate(record);
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

            let listCfg: ListFactory_ListConfig = this.cfg;
            let fields: TableColumn[] = listCfg.fields;

            fields.forEach((item: TableColumn) => { // 转换为 iView 的配置
                if (item.isShow) {
                    let rendererColDef: iViewTableColumn = { title: item.title, key: item.key, width: item.width, minWidth: item.minWidth, align: item.align };
                    CellRender(rendererColDef, item);
                    this.rendererColDef.push(rendererColDef);
                }
            });

            if (listCfg.actionButtons && listCfg.actionButtons.length)
                this.rendererColDef.push({ title: '操 作', slot: 'action', align: 'center', fixed: 'right', width: 160 });

            if (this.searchFields.length)// 定义哪些需要渲染搜索的
                this.searchFields = [];

            fields.forEach((item: TableColumn) => {
                if (item.canSearch) {
                    if (item.render == 'date' || item.render == 'short_date' || item.render == 'long_date') {
                        this.searchFields.push({ name: item.key, field: item.title + '起始日期', type: 'date' });
                        this.searchFields.push({ name: item.key, field: item.title + '结束日期', type: 'date' });
                    } else
                        this.searchFields.push({ name: item.key, field: item.title });
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
            let cfg: ListFactory_ListConfig = this.listCfg;

            if (cfg.bindingForm && cfg.bindingForm.id)
                return (cfg.bindingForm.name || "") + "#" + cfg.bindingForm.id;
            else return "未绑定";
        },

        /**
         * 选中表单配置之后
         *
         * @param formCfg
         */
        onFormSelected({ id, name }): void {
            this.$refs.SelectForm.isShowListModal = false;

            let cfg: ListFactory_ListConfig = this.listCfg;
            cfg.bindingForm.id = id;
            cfg.bindingForm.name = name;

            this.$forceUpdate();
        },
    }
}