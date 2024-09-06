import FromRenderer from '../../form/renderer/form-factory-renderer.vue';
import { Xhr } from "@ajaxjs/util";

/**
 * 列表渲染器
 * 调用器
 */
export default {
    components: { FromRenderer },
    props: {
        col: { type: Array, required: true },
        cfg: { type: Object, required: true },
        initTableData: { type: Array, required: true },
        searchFields: { type: Array, required: false },
        apiRoot: { type: String, required: false } // 可选的
    },
    data() {
        return {
            isShowForm: false,          // 是否显示表单窗体
            tableData: this.initTableData,
            list: {
                columns: [], // 未使用
                data: this.initTableData,
                total: 0,
                pageNo: 1,
                pageSize: 10,
                loading: false,
                search: {
                    name: ''
                }
            } as TableListConfig,
            form: {
                title: '',
                cfg: {} as FormFactory_Config,
                fields: [] as FormFactory_ItemConfig[]
            }
        };
    },
    methods: {
        getData(): void {
            this.list.loading = true;
            let params: any = { pageNo: this.list.pageNo, pageSize: this.list.pageSize };

            if (this.list.search.name)
                params.where = `name LIKE '%${this.list.search.name}%'`;

            let listCfg: ListFactory_ListConfig = this.cfg;
            let r: ManagedRequest = prepareRequest(listCfg.dataBinding, params, this);
            this.list.data = []; // 清空数据

            Xhr.xhr_get(r.url, (j: RepsonseResult) => {
                if (j.status) {
                    this.list.data = j.data.rows;
                    this.list.total = j.data.total;
                } else this.$Message.warning(j.message);

                this.list.loading = false;
            }, r.params);
        },

        viewEntity(row: any, rowId: number): void {
            this._openForm(row, rowId, 0);
        },

        createEntity(): void {
            this.$refs.FromRenderer.data = {};
            this.$refs.FromRenderer.$forceUpdate();
            this._openForm(null, null, 1);
        },

        editEntity(row: any, rowId: number): void {
            this._openForm(row, rowId, 2);
        },

        /**
         * 删除
         * 
         * @param url 
         * @param text 
         */
        delEntity(url: string, text: string): void {
            this.$Modal.confirm({
                title: "确认删除",
                content: "是否删除" + text + "？",
                onOk: () => {
                    Xhr.xhr_del(url, (j: RepsonseResult) => {
                        if (j && j.status) {
                            this.$Message.success('删除成功');
                            this.getData();
                        } else
                            this.$Message.error(j.message);
                    });
                },
            });
        },

        // 打开表单，这是全屏的方式
        _openCreateFormFull(formId: number, name: string): void {
            location.hash = `#/form?formId=${formId}&title=${name}`;
        },

        _openEditFormFull(formId: number, name: string, entityId: number): void {
            location.hash = `#/form?formId=${formId}&title=${name}&entityId=${entityId}`;
        },

        _openForm(row: any, rowId: number, formMode: number): void {
            // 加载表单配置
            let apiRoot: string = this.apiRoot || this.$parent.$parent.$parent.apiRoot;

            if (!apiRoot)
                alert('无法获取根目录');

            if (formMode == 0)
                this.form.title = `查看 ${row.name}`;
            else if (formMode == 1)
                this.form.title = `新建`;
            else if (formMode == 2)
                this.form.title = `编辑 ${row.name}`;

            let formCfgId: number;//  表单配置

            if (!this.cfg.bindingForm || !this.cfg.bindingForm.id) {
                alert('未绑定表单，无法打开');
                return;
            } else
                formCfgId = this.cfg.bindingForm.id;//  表单配置
                debugger

                Xhr.xhr_get(`${apiRoot}/common_api/widget_config/${formCfgId}`, (j: RepsonseResult) => {
                if (j.status) {
                    this.isShowForm = true;
                    this.form.cfg = j.data.config;// 数据库记录转换到 配置对象;
                    let cfg: FormFactory_Config = this.form.cfg;
                    this.form.fields = cfg.fields;
                    this.$refs.FromRenderer.status = formMode;

                    // if (formMode == 0 || formMode == 2) {
                    //     FormLoaderMethod.methods.loadInfo.call({
                    //         cfg: cfg,
                    //         $refs: { FromRenderer: this.$refs.FromRenderer }
                    //     }, rowId);
                    // }
                } else
                    this.$Message.error('未有任何配置');
            });
        },

        _delete(row: any, api: string): void {
            this.$Modal.confirm({
                title: '删除实体',
                content: `<p>确定删除 ${row.name || '记录'} #${row.id}？</p>`,
                onOk: () => {
                    Xhr.xhr_del(`${api}/${row.id}`, (j: RepsonseResult) => {
                        if (j.status) {
                            this.$Message.info('删除成功');
                            this.getData();
                        } else
                            this.$Message.warning(j.message);
                    });
                },
                okText: '删除'
            });
        },

        formSave(): void {

        },
        btnClk(js: string, entity?: object, index?: number): void {
            if (entity) {
                let fn: Function = new Function('row', 'index', js);
                fn.call(this, entity, index);
            } else
                eval(js);
        }
    },
    watch: {
        'list.pageNo'(v: number): void {
            this.getData();
        }
    }
};

/**
 * 数据绑定的公用方法
 */

const API_ROOT_PREFIX = '{API_ROOT_PREFIX}';


/**
 * 请求前的准备
 * 
 * @param dataBinding   配置对象
 * @param params        请求参数，可选的。如果没有则创建一个 空对象
 * @param cmp           组件实例，可选的。用于 beforeRequest 函数指定 this 指针
 * @returns 请求参数
 */
export function prepareRequest(dataBinding: DataBinding, params?: any, cmp?: any): ManagedRequest {
    if (!dataBinding) {
        alert("未有数据绑定！");
        return;
    }

    if (!dataBinding.url) {
        alert("未有 API 地址接口");
        return;
    }

    let url: string = dataBinding.url;

    if (url.indexOf(API_ROOT_PREFIX) != -1)
        url = dataBinding.url.replace(API_ROOT_PREFIX, window['config'].dsApiRoot);

    if (!params)
        params = {};

    if (dataBinding.baseParams)
        Object.assign(params, JSON.parse(dataBinding.baseParams));

    if (dataBinding.beforeRequest) {
        let before: Function = new Function('params', dataBinding.beforeRequest);
        before.call(cmp || this, params);
    }

    return { url: url, params: params };
}
