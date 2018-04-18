
import Vuex from 'vuex';
import * as mutations from "./mutation-types";
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
            async [mutations.ADD_CATEGORY](context, payload) {
                let parent = <Category | undefined>payload.parent
                if (!parent) {
                    return;
                }
                let category = parent
                let vue = new Vue()
                return vue.$prompt("名称", `${category.name}: 新子分类`, {
                    inputPattern: /.+/,
                    inputErrorMessage: "请输入名称"
                })
                    .then(data => {
                        if (typeof data == "string") {
                            return;
                        }
                        let name = data.value;
                        let parent_id = category.id;
                        let path = `${category.path}/${name}`;
                        axios
                            .post(`/api/category`, { name, parent_id, path })
                            .then(response => {
                                context.dispatch(mutations.UPDATE_CATEGORIES)
                            })
                            .catch(reason => {
                                let message: string;
                                try {
                                    message = `${reason.response.status} ${reason.response.data}`;
                                } catch (error) {
                                    console.warn("Parse fail reson failed." + error);
                                    message = String(reason);
                                }
                                vue.$notify({ title: "添加新分类失败", message, type: "error" });
                            });
                    })
                    .catch(() => {
                        vue.$message("创建取消");
                    });
            },
            async [mutations.EDIT_CATEGORY](context, payload: mutations.PayloadEditCategory) {
                return axios.put(`/api/category/${payload.id}`, payload.data).then(
                    () => context.dispatch(mutations.UPDATE_CATEGORIES)
                )
            }
        }
    }
)

export default store