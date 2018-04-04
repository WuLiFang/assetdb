import Vue from "vue";
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import IndexViewComponent from "./components/index_view.vue";
import CategoryViewComponent from "./components/category_view.vue";
import IndexComponent from "./components/index.vue";
import { Category, CategoryStorage } from "./model";
import { UPDATE_CATEGORIES } from "./mutation-types";

Vue.use(Vuex);
Vue.use(VueResource);
Vue.use(VueRouter);

const routes = [
    { path: '/', component: IndexViewComponent },
    { path: '/category/:id/:name', component: CategoryViewComponent },
]
const router = new VueRouter({ routes })
const store = new Vuex.Store(
    {
        state: {
            categories: new CategoryStorage()
        },
        mutations: {
            async [UPDATE_CATEGORIES](state) {
                return new Vue().$http.get("/api/category").then(response => {
                    let categories = new CategoryStorage();
                    response.data.forEach((data: string[]) => {
                        categories.push(Category.from_data(data));
                    });
                    state.categories = categories;
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
store.commit(UPDATE_CATEGORIES)
vue.$mount('#app')
