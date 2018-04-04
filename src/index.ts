import Vue from "vue";
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import IndexViewComponent from "./components/index_view.vue";
import CategoryViewComponent from "./components/category_view.vue";
import IndexComponent from "./components/index.vue";
import { Category, CategoryStorage } from "./model";

Vue.use(VueResource);
Vue.use(VueRouter);
const routes = [
    { path: '/', component: IndexViewComponent },
    { path: '/category/:id/:name', component: CategoryViewComponent },
]
const router = new VueRouter({ routes })
const vue = new Vue({
    router,
    data: {
        categories: new CategoryStorage()
    },
    components: {
        IndexComponent
    },
    methods: {
        async update_categories() {
            return this.$http.get("/api/category").then(response => {
                let categories = new CategoryStorage();
                response.data.forEach((data: string[]) => {
                    categories.push(Category.from_data(data));
                });
                this.categories = categories;
            });
        }
    }
})
vue.update_categories().then(
    () => {
        vue.$mount('#app')
    }
)