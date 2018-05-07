import axios from "axios";
import * as _ from "lodash";
import Vue from "vue";
import Vuex from 'vuex';
import { ResponseAssetData, ResponseCategoryData } from './interfaces';
import { Asset, AssetStorage, Category, CategoryStorage } from "./model";
import * as mutations from "./mutation-types";

Vue.use(Vuex);

const store = new Vuex.Store(
    {
        state: {
            categories: <Array<Category>>[],
            root: '',
            assets: <AssetStorage>{}
        },
        mutations: {
            [mutations.UPDATE_CATEGORIES](state, payload) {
                state.categories = <CategoryStorage>payload.categories
            },
            [mutations.UPDATE_ROOT](state, payload) {
                state.root = <string>payload.root
            },
            [mutations.SET_CATEGORY](state, payload: mutations.PayloadSetCategory) {
                let category = _.find(state.categories, value => value.id == payload.id)
                if (!category) {
                    console.error('Set category failed, no such category.')
                    return
                }
                if (payload.count) {
                    category.count = payload.count
                }
            },
            [mutations.LOAD_ASSETS](state, payload: mutations.PayloadLoadAssets) {
                payload.assets.forEach(value => state.assets[value.id] = value)
            }
        },
        actions: {
            async [mutations.UPDATE_CATEGORIES](context) {
                return axios.get("/api/category").then(response => {
                    let categories = new CategoryStorage();
                    response.data.forEach((data: ResponseCategoryData) => {
                        categories.push(Category.from_data(data));
                    });
                    context.commit(mutations.UPDATE_CATEGORIES, { categories })
                    new Vue().$notify({ title: '更新分类', message: '成功', type: 'success' })
                }).catch(
                    reason => {
                        let message = String(reason)
                        new Vue().$notify({ title: '更新分类失败', message, type: 'error' })
                    }
                );
            },
            async [mutations.UPDATE_ROOT](context) {
                return axios.get(`/api/root?platform=${window.navigator.platform}`).then(
                    response => {
                        context.commit(mutations.UPDATE_ROOT, { root: response.data })
                    }
                )
            },
            async [mutations.ADD_CATEGORY](context, payload: mutations.PayloadAddCategory) {
                return axios.post(`/api/category`, payload).then(response => {
                    context.dispatch(mutations.UPDATE_CATEGORIES)
                })
            },
            async [mutations.EDIT_CATEGORY](context, payload: mutations.PayloadEditCategory) {
                return axios.put(`/api/category/${payload.id}`, payload.data).then(
                    () => context.dispatch(mutations.UPDATE_CATEGORIES)
                )
            },
            async [mutations.COUNT_CATEGORY](context, payload: mutations.PayloadCategoryId) {
                return axios.get(`/api/category/${payload.id}/count`).then(
                    response => {
                        let _payload: mutations.PayloadSetCategory = { id: payload.id, count: response.data }
                        context.commit(mutations.SET_CATEGORY, _payload)
                    }
                )
            },
            async [mutations.DELETE_CATEGORY](context, payload: mutations.PayloadCategoryId) {
                return axios.delete(`/api/category/${payload.id}`).then(
                    () => context.dispatch(mutations.UPDATE_CATEGORIES)
                )
            },
            async [mutations.LOAD_ASSETS](context, payload: mutations.PayloadCategoryId) {
                return axios
                    .get(`/api/category/${payload.id}/assets`)
                    .then(
                        response => {
                            let data = <Array<ResponseAssetData>>response.data
                            let assets = (data).map(value => Asset.from_data(value));
                            let payload: mutations.PayloadLoadAssets = { assets }
                            context.commit(mutations.LOAD_ASSETS, payload)
                        }
                    )
            },
            async [mutations.LOAD_ASSET](context, payload: mutations.PayloadAssetId) {
                return axios.get(`/api/asset/${payload.id}`).then(
                    response => {
                        let data = <ResponseAssetData>response.data
                        let assets = [Asset.from_data(data)];
                        let payload: mutations.PayloadLoadAssets = { assets }
                        context.commit(mutations.LOAD_ASSETS, payload)
                    }
                )
            }
        }
    }
)

export default store
