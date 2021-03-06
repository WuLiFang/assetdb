import Vue from "vue";
import Vuex from 'vuex';
import VueRouter from 'vue-router';


import ElementUI from 'element-ui';
// import "element-ui/lib/theme-chalk/display.css";
import 'element-ui/lib/theme-chalk/index.css';

import TheAssetView from "./components/TheAssetView.vue";
import TheFileView from "./components/TheFileView.vue";
import TheCategoryView from "./components/TheCategoryView.vue";
import TheIndex from "./components/TheIndex.vue";
import TheIndexView from "./components/TheIndexView.vue";
import TheAdminView from "./components/TheAdminView.vue";

import * as mutations from "./mutation-types";
import _store from './store';


Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(ElementUI);

const store = new Vuex.Store(_store)

const routes = [
    { path: '/', component: TheIndexView },
    { path: '/category/:id', component: TheCategoryView, alias: '/category/:id/:name' },
    { path: '/asset/:id', component: TheAssetView, alias: '/asset/:id/:name' },
    { path: '/file/:id', component: TheFileView, alias: '/file/:id/:name' },
    { path: '/admin', component: TheAdminView },
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

vue.$mount('#app')
