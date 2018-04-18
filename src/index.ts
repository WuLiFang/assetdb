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
import CategoryViewComponent from "./components/category_view.vue";
import IndexComponent from "./components/index.vue";

Vue.use(VueRouter);
Vue.use(ElementUI);

const routes = [
    { path: '/', component: IndexViewComponent },
    { path: '/category/:id', component: CategoryViewComponent, alias: '/category/:id/:name' },
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
