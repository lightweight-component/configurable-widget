import { xhr_get } from '@ajaxjs/util/dist/util/xhr';
import CellRender from '../factory-list-def/renderer/list-cell-render';

export default {
    props: {
        widgetName: { type: String, required: false },
        apiUrl: { type: String, required: false },  // 接口地址
        columnsDef: { type: Array, required: false },  // 列定义
        listApiUrl: { type: String, required: false },
        onCreateBtn: { type: Function, required: false },
        isRemoteColDef: { type: Boolean, required: false, default: false }
        // colDefId: { type: Number, required: false }
    },
    data() {
        return {
            widgetName_: this.widgetName,
            listApiUrl_: this.listApiUrl,
            colDefId: 0,
            list: {
                columns: this.columnsDef || [],
                data: [],
                total: 0,
                start: 0,
                limit: 9,
                pageNo: 1,
                pageSize: 9,
                loading: false,
                search: {
                    name: ''
                },
            } as TableListConfig
        };
    },
    mounted() {
        // this.isRemoteColDef && this.getRemoteColDef();
        if (!this.isRemoteColDef)
            this.getData();
    },
    methods: {
        /**
         * 加载列定义
         */
        getRemoteColDef(): void {
            xhr_get(`${window.config.dsApiRoot}/common_api/widget_config/${this.colDefId}`, (j: RepsonseResult) => {
                this.list.loading = false;

                if (j.status) {
                    this.widgetName_ = j.data.name;

                    this.listApiUrl_ = j.data.config.httpApi.replace('{project_prefix}', window.config.IAM_ApiRoot);
                    let colDefs: TableColumn[] = j.data.config.colConfig;
                    this.list.columns = [];

                    colDefs.forEach((item: TableColumn) => { // 转换为 iView 的配置
                        if (item.isShow) {
                            let rendererColDef: iViewTableColumn = { title: item.title, key: item.key, width: item.width, minWidth: item.minWidth, align: item.align };

                            CellRender(rendererColDef, item);

                            this.list.columns.push(rendererColDef);
                        }
                    });

                    this.getData();
                } else
                    this.$Message.warning(j.message || '获取列表失败');
            });
        },
        getData(): void {
            this.list.loading = true;
            let params: any = { pageNo: this.list.pageNo, pageSize: this.list.pageSize };

            // if (this.list.search.name)
            //     params.where = `name LIKE '%${this.list.search.name}%'`;

            xhr_get(this.listApiUrl_, (j: RepsonseResult) => {
                this.list.loading = false;


                if (j.status) {
                    this.list.data = j.data.rows;
                    this.list.total = j.data.total;
                } else
                    this.$Message.warning(j.message || '获取列表失败');
            }, params);
        },

        /**
         * 分页记录数
         */
        handleChangePageSize(pageSize: number): void {
            this.list.limit = pageSize;
            this.getData();
        },
        reset(): void {
            for (let i in this.search)
                this.search[i] = "";

            this.getData();
        },
    },
    watch: {
        /**
         * 分页
         * 
         * @param v 
         */
        current(v: number): void {
            this.start = (v - 1) * this.list.limit;
            this.getData();
        },
        'list.pageNo'(v: number): void {
            this.list.start = (v - 1) * this.list.limit;
            this.getData();
        },
        colDefId(v: number): void {
            this.getRemoteColDef();
        }
    },
};