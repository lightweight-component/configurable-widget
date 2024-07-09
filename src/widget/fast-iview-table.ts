import { xhr_get } from '@ajaxjs/util/dist/util/xhr';

export default {
    props: {
        widgetName: { type: String, required: true },
        apiUrl: { type: String, required: false },  // 接口地址
        columnsDef: { type: Array, required: true },  // 列定义
        listApiUrl: { type: String, required: false }
    },
    data() {
        return {
            list: {
                columns: [],
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
        this.getData();
    },
    methods: {
        o(){debugger;},
        getData(): void {
            this.list.loading = true;
            let params: any = { pageNo: this.list.pageNo, pageSize: this.list.pageSize };

            // if (this.list.search.name)
            //     params.where = `name LIKE '%${this.list.search.name}%'`;

            xhr_get(this.listApiUrl, (j: RepsonseResult) => {
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
        }
    },
};