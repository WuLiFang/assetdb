
import Vuex from 'vuex';
import * as mutations from "./mutation-types";
import * as _ from "lodash";
import { Category, CategoryStorage } from "./model";
import axios from "axios";

import Vue from "vue";
Vue.use(Vuex);

const store = new Vuex.Store(
    {
        state: {
            categories: new CategoryStorage(),
            root: ''
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
            }
        },
        actions: {
            async [mutations.UPDATE_CATEGORIES](context) {
                return axios.get("/api/category").then(response => {
                    let categories = new CategoryStorage();
                    response.data.forEach((data: string[]) => {
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
        }
    }
)

export default store