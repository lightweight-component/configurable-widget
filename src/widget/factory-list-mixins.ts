import List from '@ajaxjs/ui/dist/iView-ext/fast-iview-table/list';
import { xhr_get, xhr_del } from '@ajaxjs/util/dist/util/xhr';

/**
 * 组件生成器公用
 */
export default {
    props: {
        apiRoot: { type: String, required: false },   // 接口前缀。与 完整的 API 地址 二选一
        api: { type: String, required: false }       // 完整的 API 地址。与 接口前缀 二选一
    },
    data() {
        return {
            isShowEdit: false,  // 编辑
            perview: {          // 预览
                isShow: false,
                title: '',
                data: {},        // 配置对象
            }
        };
    },

    methods: {
        deleteInfo(id: number, index: number): void {
            this.list.loading = true;
            xhr_del(`${this.API}/${id}`, List.afterDelete(() => {
                this.list.data.splice(index, 1);
                this.list.total--;
                this.list.loading = false;
            }).bind(this));
        },

        getData(): void {
            this.list.loading = true;
            let params: any = { start: this.list.start, limit: this.list.limit };

            if (this.list.search.name)
                params.where = `name LIKE '%${this.list.search.name}%'`;

            let api: string = `${this.API}/page`;

            if (this.listParams)
                api += '?' + this.listParams;

            xhr_get(api, (j: RepsonseResult) => {
                this.list.loading = false;

                if (j.status) {
                    this.list.data = j.data.rows;
                    this.list.total = j.data.total;
                } else
                    this.$Message.warning(j.message || '未知异常');
            }, params);
        },

    }
};