import { xhr_get, xhr_put, xhr_post } from '@ajaxjs/util/dist/util/xhr';
import { findNode } from "./info/info";
import FromRenderer from "./renderer/form-factory-renderer.vue";

export default {
    components: { FromRenderer },
    props: {
        cfg: { type: Object, required: false }, // 表单配置，演示时候传入
        formId: { type: Number, required: false }, // 表单配置 id
        isShowBtns: { type: Boolean, required: false, default: true }, // 是否显示按钮，还是自定义按钮？
    },
    data() {
        return {
            entityId: 0, // 实体 id
            cfg_: this.cfg, //{ fields: [] },
            status: 1, // 0=查看/1=新增/2=修改
            oldJson: null, // JSON Based 下的旧 JSON 完整数据。因为 data 只有部分
        };
    },
    mounted(): void {
        if (this.formId)
            this.load();
    },
    methods: {
        /**
         * 加载表单配置
         */
        load(): void {
            if (this.entityId)
                // 有 id 表示修改状态
                this.status = 2;
            else {
                this.status = 1;
                this.$refs.FromRenderer.data = {};
            }

            xhr_get(`${window["config"].dsApiRoot}/common_api/widget_config/${this.formId}`, (j: RepsonseResult) => {
                if (j && j.status) {
                    this.cfg = j.data.config;

                    let cfg: FormFactory_Config = this.cfg;
                    let isJsonBased = cfg.jsonBased.isJsonBased;
                    let dataBinding: DataBinding = cfg.dataBinding;

                    if (isJsonBased) {
                        this.status = 2; // JSON 配置模式下没有新建

                        xhr_get(dataBinding.url, (j: RepsonseResult) => {
                            this.oldJson = j; // 完整的

                            let jsonTarget: any = findNode(this.oldJson, this.entityId.split(".")); // 部分的，目标的

                            this.$refs.FromRenderer.data = {};
                            Object.assign(this.$refs.FromRenderer.data, jsonTarget);
                        });
                    } else {
                        if (this.entityId) {// 加载单笔内容
                            this.$refs.FromRenderer.data = {};

                            xhr_get(`${dataBinding.url}/${this.entityId}`, (j: RepsonseResult) => {
                                if (isJsonBased) {
                                    this.$refs.FromRenderer.data = j;
                                    this.$refs.FromRenderer.$forceUpdate();
                                } else {
                                    let r = j.data;

                                    if (r) {
                                        this.$refs.FromRenderer.data = r;
                                        this.$refs.FromRenderer.$forceUpdate();
                                    } else this.$Message.warning("获取单笔内容失败");
                                }
                            });
                        }
                    }
                } else this.$Message.error("获取表单配置失败");
            });
        },

        /**
         * 重置表单，但没作用
         */
        resetFields(): void {
            this.$refs.FromRenderer.$refs.formDynamic.resetFields();
        },

        /**
         * 创建
         */
        create(): void {
            let cfg: FormFactory_Config = this.cfg, api: DataBinding;

            let callback = (j: RepsonseResult) => {
                if (j.status) {
                    this.$Message.success(j.message);
                    setTimeout(() => location.hash = location.hash + '&entityId=' + j.data, 2000);
                } else
                    this.$Message.error(j.message || '创建失败，原因未知！');
            };

            if (cfg.isRESTful_writeApi) {
                api = cfg.updateApi;
                let r: ManagedRequest = this._initParams(api);

                xhr_post(r.url, callback, r.params);
            } else {
                api = cfg.createApi;
                let r: ManagedRequest = this._initParams(api);

                (api.httpMethod == 'post' ? xhr_post : xhr_put)(r.url, callback, r.params);
            }
        },

        /**
          * 更新
          */
        update(): void {
            let cfg: FormFactory_Config = this.cfg, api: DataBinding = cfg.updateApi;
            let params: any = api.baseParams || {};

            if (cfg.jsonBased.isJsonBased) {// Raw body post
                let jsonTarget: any = findNode(this.oldJson, this.entityId.split('.'));
                Object.assign(jsonTarget, this.$refs.FromRenderer.data);

                let json: string = JSON.stringify(r.params);
                console.log(json);

                xhr_post(api.url, (j: RepsonseResult) => {
                    console.log(j)
                }, json, { contentType: 'application/json' });
            } else {
                let r: ManagedRequest = this._initParams(api, this.$refs.FromRenderer.data, this);

                xhr_put(r.url, (j: RepsonseResult) => {
                    if (j.status)
                        this.$Message.success(j.message);
                    else
                        this.$Message.error(j.message || '更新失败，原因未知！');
                }, r.params);
            }
        }
    },
};