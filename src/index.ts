import Vue from "vue";
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import axios from "axios";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import IndexViewComponent from "./components/index_view.vue";
import CategoryViewComponent from "./components/category_view.vue";
import IndexComponent from "./components/index.vue";
import { Category, CategoryStorage } from "./model";
import { UPDATE_CATEGORIES, UPDATE_ROOT, ADD_CATEGORY } from "./mutation-types";

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(ElementUI);

const routes = [
    { path: '/', component: IndexViewComponent },
    { path: '/category/:id', component: CategoryViewComponent, alias: '/category/:id/:name' },
]
const router = new VueRouter({ routes })
const store = new Vuex.Store(
    {
        state: {
            categories: new CategoryStorage(),
            root: ''
        },
        mutations: {
            [UPDATE_CATEGORIES](state, payload) {
                state.categories = <CategoryStorage>payload.categories
            },
            [UPDATE_ROOT](state, payload) {
                state.root = <string>payload.root
            }
        },
        actions: {
            async [UPDATE_CATEGORIES](context) {
                return axios.get("/api/category").then(response => {
                    let categories = new CategoryStorage();
                    response.data.forEach((data: string[]) => {
                        categories.push(Category.from_data(data));
                    });
                    context.commit(UPDATE_CATEGORIES, { categories })
                    new Vue().$notify({ title: '更新分类', message: '成功', type: 'success' })
                }).catch(
                    reason => {
                        let message = String(reason)
                        new Vue().$notify({ title: '更新分类失败', message, type: 'error' })
                    }
                );
            },
            async [UPDATE_ROOT](context) {
                return axios.get(`/api/root?platform=${window.navigator.platform}`).then(
                    response => {
                        context.commit(UPDATE_ROOT, { root: response.data })
                    }
                )
            },
            async [ADD_CATEGORY](context, payload) {
                let parent = <Category | undefined>payload.parent
                if (!parent) {
                    return;
                }
                let category = parent
                let vue = new Vue()
                return vue.$prompt("名称", `${category.name}: 新子分类`, {
                    inputPattern: /.+/,
                    inputErrorMessage: "请输入名称"
                })
                    .then(data => {
                        if (typeof data == "string") {
                            return;
                        }
                        let name = data.value;
                        let parent_id = category.id;
                        let path = `${category.path}/${name}`;
                        axios
                            .post(`/api/category`, { name, parent_id, path })
                            .then(response => {
                                context.dispatch(UPDATE_CATEGORIES)
                            })
                            .catch(reason => {
                                let message: string;
                                try {
                                    message = `${reason.response.status} ${reason.response.data}`;
                                } catch (error) {
                                    console.warn("Parse fail reson failed." + error);
                                    message = String(reason);
                                }
                                vue.$notify({ title: "添加新分类失败", message, type: "error" });
                            });
                    })
                    .catch(() => {
                        vue.$message("创建取消");
                    });
            }
        }
    }
)
const vue = new Vue({
    router,
    store,
    components: {
        IndexComponent
    }
})
store.dispatch(UPDATE_ROOT)
store.dispatch(UPDATE_CATEGORIES)
vue.$mount('#app')
