import Vue from "vue";
import VueRouter from 'vue-router';
import axios from "axios";

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "element-ui/lib/theme-chalk/display.css";

import { Category, CategoryStorage } from "./model";
import * as mutations from "./mutation-types";
import store from './store';

import IndexViewComponent from "./components/index_view.vue";
import CategoryView from "./components/category_view.vue";
import AssetView from "./components/asset_view.vue";
import IndexComponent from "./components/index.vue";

Vue.use(VueRouter);
Vue.use(ElementUI);

const routes = [
    { path: '/', component: IndexViewComponent },
    { path: '/category/:id', component: CategoryView, alias: '/category/:id/:name' },
    { path: '/asset/:id', component: AssetView, alias: '/asset/:id/:name' },
]
const router = new VueRouter({ routes })

const vue = new Vue({
    router,
    store,
    components: {
        IndexComponent
    }
})
store.dispatch(mutations.UPDATE_ROOT)
store.dispatch(mutations.UPDATE_CATEGORIES)
vue.$mount('#app')
