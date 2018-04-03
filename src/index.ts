import Vue from "vue";
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import IndexViewComponent from "./components/index_view.vue";
import CategoryViewComponent from "./components/category_view.vue";
import IndexComponent from "./components/index.vue";

Vue.use(VueResource);
Vue.use(VueRouter);
const routes = [
    { path: '/', component: IndexViewComponent },
    { path: '/category/:id/:name', component: CategoryViewComponent },
]
const router = new VueRouter({ routes })
new Vue({
    router,
    components: {
        IndexComponent
    }
}).$mount('#app')