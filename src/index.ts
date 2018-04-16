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
import { UPDATE_CATEGORIES, UPDATE_ROOT } from "./mutation-types";

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
            async [UPDATE_CATEGORIES](state) {
                return axios.get("/api/category").then(response => {
                    let categories = new CategoryStorage();
                    response.data.forEach((data: string[]) => {
                        categories.push(Category.from_data(data));
                    });
                    state.categories = categories;
                    new Vue().$notify({ title: '更新分类', message: '成功', type: 'success' })
                }).catch(
                    reason => {
                        let message = String(reason)
                        new Vue().$notify({ title: '更新分类失败', message, type: 'error' })
                    }
                );
            },
            async [UPDATE_ROOT](state) {
                return axios.get(`/api/root?platform=${window.navigator.platform}`).then(
                    response => {
                        state.root = response.data
                    }
                )
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
store.commit(UPDATE_ROOT)
store.commit(UPDATE_CATEGORIES)
vue.$mount('#app')
