import Vue from 'vue';
import { Module, MutationTree, ActionTree, GetterTree, mapGetters, mapState } from 'vuex';
import { DefaultComputed } from "vue/types/options";

import * as _ from "lodash";
import axios from "axios";

import { ResponseCategoryData } from '../interfaces';
import { Category, CategoryStorage } from "../model";
import * as MutationTypes from "../mutation-types";
import { RootState, CategoryState, CategoryMetaData, CategoryArrayMap, RouteURLMap, CountMap } from './types'
import { taggedTemplateExpression } from 'babel-types';

export const state: CategoryState = { storage: {}, countMap: {} }

interface TreeModel {
    id: string;
    label: string;
    category: Category;
    children?: TreeModel[];
    disabled?: boolean;
    isLeaf?: boolean;
}


function categoryChildrenMap(state: CategoryState): CategoryArrayMap {
    let ret: CategoryArrayMap = {}

    let getCategoryChildren = (category: Category) => {
        return _.filter(state.storage, value => value.parent_id == category.id)
    }
    _.each(state.storage, item => ret[item.id] = getCategoryChildren(item))
    return ret
}

function categoryRouteURLMap(state: CategoryState): RouteURLMap {
    let ret: RouteURLMap = {}
    _.each(state.storage, category => ret[category.id] = `/category/${category.id}/${category.name}`)
    return ret
}

function categoryRecurseCountMap(state: CategoryState, childrenMap: CategoryArrayMap): CountMap {
    let getRecurseCount = (category: Category): number => {
        let count = state.countMap[category.id] || 0
        return childrenMap[category.id].reduce((prev, current) => prev + getRecurseCount(current), count)
    }
    let ret: CountMap = {}
    _.each(state.storage, item => ret[item.id] = getRecurseCount(item))
    return ret
}

export const getters: GetterTree<CategoryState, RootState> = {
    categoryMetaData: (state): CategoryMetaData => {
        let childrenMap = categoryChildrenMap(state)
        return {
            childrenMap,
            routeURLMap: categoryRouteURLMap(state),
            root: _.find(state.storage, value => !value.parent_id),
            recurseCountMap: categoryRecurseCountMap(state, childrenMap)
        }
    },

    isValidCategoryRelationship: (state) => {
        let isValid = (child: Category, parent: Category): Boolean => {
            if (parent.parent_id == child.id) {
                return false
            }

            let grandparent = parent.parent_id ? state.storage[parent.parent_id] : null
            return !grandparent || isValid(child, grandparent)
        }
        return isValid
    },

    getLogicalCategoryPath: (state) => (category: Category): Category[] => {
        let ret: Category[] = [];
        let parent_id: string | null;
        let parent: Category | undefined;
        let current = category

        while (current) {
            ret.push(current);
            parent_id = current.parent_id;
            if (!parent_id) {
                break
            }
            parent = state.storage[parent_id]
            current = parent;
        }
        ret.reverse();
        return ret;
    },

}
interface CategoryComputedMixin extends DefaultComputed {
    categoryStore: () => CategoryState
    categoryMetaData: () => CategoryMetaData
    isValidCategoryRelationship: () => (child: Category, parent: Category) => Boolean
    getLogicalCategoryPath: () => (category: Category) => Array<Category>
}

export const categoryComputedMinxin = <CategoryComputedMixin>{
    ...mapState(
        ['categoryStore']
    ),
    ...mapGetters([
        'categoryMetaData',
        'isValidCategoryRelationship',
        'getLogicalCategoryPath',
    ])
}

const mutations: MutationTree<typeof state> = {
    [MutationTypes.UPDATE_CATEGORIES](state, payload: MutationTypes.PayloadUpdateCategories) {
        payload.categories.forEach(i => Vue.set(state.storage, i.id, i))
    },
    [MutationTypes.COUNT_CATEGORY](state, payload: MutationTypes.PayloadSetCategoryCount) {
        Vue.set(state.countMap, payload.id, payload.count)
    },
    [MutationTypes.DELETE_CATEGORY](state, payload: MutationTypes.PayloadCategoryID) {
        Vue.delete(state.storage, payload.id)
        Vue.delete(state.countMap, payload.id)
    }
}

const actions: ActionTree<typeof state, RootState> = {
    async [MutationTypes.UPDATE_CATEGORIES](context) {
        return axios.get("/api/category").then(response => {
            let data: Array<ResponseCategoryData> = response.data
            let payload: MutationTypes.PayloadUpdateCategories = { categories: data.map(value => Category.from_data(value)) }
            context.commit(MutationTypes.UPDATE_CATEGORIES, payload)
        })
    },
    async [MutationTypes.ADD_CATEGORY](context, payload: MutationTypes.PayloadAddCategory) {
        return axios.post(`/api/category`, payload).then(response => {
            context.dispatch(MutationTypes.UPDATE_CATEGORIES)
        })
    },
    async [MutationTypes.EDIT_CATEGORY](context, payload: MutationTypes.PayloadEditCategory) {
        return axios.put(`/api/category/${payload.id}`, payload.data).then(
            () => context.dispatch(MutationTypes.UPDATE_CATEGORIES)
        )
    },
    async [MutationTypes.COUNT_CATEGORY](context, payload: MutationTypes.PayloadCategoryID) {
        return axios.get(`/api/category/${payload.id}/count`).then(
            response => {
                let count: number | null = response.data
                if (count) {
                    let _payload: MutationTypes.PayloadSetCategoryCount = { id: payload.id, count }
                    context.commit(MutationTypes.COUNT_CATEGORY, _payload)
                }
            }
        )
    },
    async [MutationTypes.DELETE_CATEGORY](context, payload: MutationTypes.PayloadCategoryID) {
        return axios.delete(`/api/category/${payload.id}`).then(
            () => context.commit(MutationTypes.DELETE_CATEGORY, payload)
        )
    },
}

const module: Module<typeof state, RootState> =
    {
        state,
        getters,
        mutations,
        actions
    }

export default module