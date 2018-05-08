import Vue from "vue";
import VueRouter from 'vue-router';

import ElementUI from 'element-ui';
import "element-ui/lib/theme-chalk/display.css";
import 'element-ui/lib/theme-chalk/index.css';

import TheAssetView from "./components/TheAssetView.vue";
import TheFileView from "./components/TheFileView.vue";
import TheCategoryView from "./components/TheCategoryView.vue";
import TheIndex from "./components/TheIndex.vue";
import TheIndexView from "./components/TheIndexView.vue";

import * as mutations from "./mutation-types";
import store from './store';


Vue.use(VueRouter);
Vue.use(ElementUI);

const routes = [
    { path: '/', component: TheIndexView },
    { path: '/category/:id', component: TheCategoryView, alias: '/category/:id/:name' },
    { path: '/asset/:id', component: TheAssetView, alias: '/asset/:id/:name' },
    { path: '/file/:id', component: TheFileView, alias: '/file/:id/:name' },
]
const router = new VueRouter({ routes })

const vue = new Vue({
    router,
    store,
    template: '<TheIndex/>',
    components: {
        TheIndex
    }
})
store.dispatch(mutations.UPDATE_ROOT)
store.dispatch(mutations.UPDATE_CATEGORIES)
vue.$mount('#app')
