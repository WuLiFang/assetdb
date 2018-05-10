import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { DefaultComputed } from "vue/types/options";

import * as _ from "lodash";
import axios from "axios";

import { ResponseCategoryData } from '../interfaces';
import { Category, CategoryStorage } from "../model";
import * as MutationTypes from "../mutation-types";
import { RootState, CategoryState, CategoryChildrenMap, CategoryRouteURLMap, CategoryMetaData, CategoryRecurseCountMap } from './types'
import { taggedTemplateExpression } from 'babel-types';

export const state: CategoryState = { storage: {} }

interface TreeModel {
    id: string;
    label: string;
    category: Category;
    children?: TreeModel[];
    disabled?: boolean;
    isLeaf?: boolean;
}


function categoryChildrenMap(state: CategoryState): CategoryChildrenMap {
    let ret: CategoryChildrenMap = {}

    let getCategoryChildren = (category: Category) => {
        return _.filter(state.storage, value => value.parent_id == category.id)
    }
    _.each(state.storage, item => ret[item.id] = getCategoryChildren(item))
    return ret
}

function categoryRouteURLMap(state: CategoryState): CategoryRouteURLMap {
    let ret: CategoryRouteURLMap = {}
    _.each(state.storage, category => ret[category.id] = `/category/${category.id}/${category.name}`)
    return ret
}

function categoryRecurseCountMap(state: CategoryState, childrenMap: CategoryChildrenMap): CategoryRecurseCountMap {
    let getRecurseCount = (category: Category): number => {
        let count = category.count ? category.count : 0
        return childrenMap[category.id].reduce((prev, current) => prev + getRecurseCount(current), count)
    }
    let ret: CategoryRecurseCountMap = {}
    _.each(state.storage, item => ret[item.id] = getRecurseCount(item))
    return ret
}

export const getters: GetterTree<typeof state, RootState> = {
    categoryMetaData: (state): CategoryMetaData => {
        let childrenMap = categoryChildrenMap(state)
        return {
            childrenMap,
            routeURLMap: categoryRouteURLMap(state),
            root: _.find(state.storage, value => !value.parent_id),
            recurseCountMapp: categoryRecurseCountMap(state, childrenMap)
        }
    },

    isValidCategoryRelationship: (state) => {
        let isValid = (child: Category, parent: Category): Boolean => {
            if (parent.parent_id == child.id) {
                return false
            }
            let grandparent = state.storage[parent.parent_id]
            return !grandparent || isValid(child, grandparent)
        }
        return isValid
    },

    getLogicalCategoryPath: (state) => (category: Category): Category[] => {
        let ret: Category[] = [];
        let parent_id: number;
        let parent: Category | undefined;
        let current = category

        while (current) {
            ret.push(current);
            parent_id = current.parent_id;
            parent = state.storage[parent_id]
            if (!parent) {
                break
            }
            current = parent;
        }
        ret.reverse();
        return ret;
    },

}
interface CategoryGetterMixin extends DefaultComputed {
    rootCategory: () => Category | null
    childrenMap: () => CategoryChildrenMap
    routeURLMap: () => CategoryRouteURLMap
    storage: () => CategoryStorage

}
export const categoryGetterMinxin: CategoryGetterMixin = {
    rootCategory(): Category | null {
        return this.$store.getters.categoryMetaData.root;
    },
    childrenMap(): CategoryChildrenMap {
        return this.$store.getters.categoryMetaData.childrenMap;
    },
    routeURLMap(): CategoryRouteURLMap {
        return this.$store.getters.categoryMetaData.routeURLMap;
    },
    storage(): CategoryStorage {
        return this.$store.state.category.storage;
    }
};
const mutations: MutationTree<typeof state> = {
    [MutationTypes.UPDATE_CATEGORIES](state, payload: MutationTypes.PayloadUpdateCategories) {
        let storage: CategoryStorage = {}
        payload.categories.map(value => storage[value.id] = value)
        state.storage = storage
    },
    [MutationTypes.SET_CATEGORY](state, payload: MutationTypes.PayloadSetCategory) {
        let category = _.find(state.storage, value => value.id == payload.id)
        if (!category) {
            console.error('Set category failed, no such category.')
            return
        }
        if (payload.count) {
            category.count = payload.count
        }
    },
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
                let _payload: MutationTypes.PayloadSetCategory = { id: payload.id, count: response.data }
                context.commit(MutationTypes.SET_CATEGORY, _payload)
            }
        )
    },
    async [MutationTypes.DELETE_CATEGORY](context, payload: MutationTypes.PayloadCategoryID) {
        return axios.delete(`/api/category/${payload.id}`).then(
            () => context.dispatch(MutationTypes.UPDATE_CATEGORIES)
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