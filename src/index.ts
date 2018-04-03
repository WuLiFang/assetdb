import Vue from "vue";
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import IndexViewComponent from "./components/index_view.vue";

Vue.use(VueResource);
Vue.use(VueRouter);
const routes = [
    { path: '/', component: IndexViewComponent }
]
const router = new VueRouter({ routes })
new Vue({ router }).$mount('#app')