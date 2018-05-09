import Vue from "vue";
import Vuex from 'vuex';

import * as _ from "lodash";
import axios from "axios";

import { ResponseAssetData, ResponseCategoryData, ResponseAssetFileData } from './interfaces';
import { Asset, AssetStorage, Category, CategoryStorage, AssetFileStorage, AssetFile } from "./model";
import * as mutations from "./mutation-types";
import { file } from "babel-types";

Vue.use(Vuex);

const store = new Vuex.Store(
    {
        state: {
            categories: <Array<Category>>[],
            root: '',
            assets: <AssetStorage>{},
            files: <AssetFileStorage>{},
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
            [mutations.UPDATE_ASSETS](state, payload: mutations.PayloadUpdateAssets) {
                payload.assets.forEach(value => state.assets[value.id] = value)
            },
            [mutations.UPDATE_ASSET_FILES](state, payload: mutations.PayloadUpdateAssetFiles) {
                payload.files.forEach(value => state.files[value.id] = value)
            },
            [mutations.UPDATE_ASSET_RELATED_FILES](state, payload: mutations.PayloadUpdateAssetRelatedFiles) {
                let asset = state.assets[payload.id]
                if (!asset) {
                    console.warn(`Asset not found, id: ${payload.id}`)
                    return
                }
                asset.files = payload.files
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
            async [mutations.COUNT_CATEGORY](context, payload: mutations.PayloadCategoryID) {
                return axios.get(`/api/category/${payload.id}/count`).then(
                    response => {
                        let _payload: mutations.PayloadSetCategory = { id: payload.id, count: response.data }
                        context.commit(mutations.SET_CATEGORY, _payload)
                    }
                )
            },
            async [mutations.DELETE_CATEGORY](context, payload: mutations.PayloadCategoryID) {
                return axios.delete(`/api/category/${payload.id}`).then(
                    () => context.dispatch(mutations.UPDATE_CATEGORIES)
                )
            },
            async [mutations.UPDATE_ASSETS](context, payload: mutations.PayloadCategoryID) {
                return axios
                    .get(`/api/category/${payload.id}/assets`)
                    .then(
                        response => {
                            let data = <Array<ResponseAssetData>>response.data
                            let assets = (data).map(value => Asset.from_data(value));
                            let payload: mutations.PayloadUpdateAssets = { assets }
                            context.commit(mutations.UPDATE_ASSETS, payload)
                        }
                    )
            },
            async [mutations.UPDATE_ASSET](context, payload: mutations.PayloadAssetID) {
                return axios.get(`/api/asset/${payload.id}`).then(
                    response => {
                        let data = <ResponseAssetData>response.data
                        let assets = [Asset.from_data(data)];
                        let payload: mutations.PayloadUpdateAssets = { assets }
                        context.commit(mutations.UPDATE_ASSETS, payload)
                    }
                )
            },
            async [mutations.UPDATE_ASSET_RELATED_FILES](context, payload: mutations.PayloadAssetID) {
                return axios.get(`/api/asset/${payload.id}/files`).then(
                    response => {
                        let data = <Array<ResponseAssetFileData>>response.data
                        let files = data.map(value => AssetFile.from_data(value))
                        let files_payload: mutations.PayloadUpdateAssetFiles = { files }
                        context.commit(mutations.UPDATE_ASSET_FILES, files_payload)
                        let asset_payload: mutations.PayloadUpdateAssetRelatedFiles = { id: payload.id, files }
                        context.commit(mutations.UPDATE_ASSET_RELATED_FILES, asset_payload)
                    }
                )
            },
            async [mutations.UPDATE_ASSET_FILES](context) {
                return axios.get('/api/file').then(
                    response => {
                        let data = <Array<ResponseAssetFileData>>response.data
                        let files = data.map(value => AssetFile.from_data(value))
                        let payload: mutations.PayloadUpdateAssetFiles = { files }
                        context.commit(mutations.UPDATE_ASSET_FILES, payload)
                    }
                )
            },
            async [mutations.UPDATE_ASSET_FILE](context, payload: mutations.PayloadAssetFileID) {
                return axios.get(`/api/file/${payload.id}`).then(
                    response => {
                        let data = <ResponseAssetFileData>response.data
                        let files = [AssetFile.from_data(data)]
                        let files_payload: mutations.PayloadUpdateAssetFiles = { files }
                        context.commit(mutations.UPDATE_ASSET_FILES, files_payload)
                    }
                )
            }

        }
    }
)

export default store
