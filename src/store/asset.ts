import Vue from 'vue';
import { Module, MutationTree, ActionTree, mapState, GetterTree, mapGetters } from 'vuex';
import { DefaultComputed } from "vue/types/options";

import * as _ from "lodash";
import axios from "axios";

import { ResponseAssetData, } from '../interfaces';
import { Asset, AssetStorage, AssetFile, Category } from "../model";
import * as MutationTypes from "../mutation-types";
import { RootState, AssetState, AssetMetaData, RouteURLMap, CombinedRootState } from './types'

export const state: AssetState = {
    storage: {}, fileMap: {}
}

const getters: GetterTree<AssetState, RootState> = {
    assetMetaData(state): AssetMetaData {
        let routeURLMap: RouteURLMap = {}
        _.each(state.storage, i => routeURLMap[i.id] = `/asset/${i.id}/${i.name}`)
        return {
            routeURLMap
        }
    },
}
interface AssetComputedMixin extends DefaultComputed {
    assetStore: () => AssetState
    assetMetaData: () => AssetMetaData
}

export const assetComputedMinxin = <AssetComputedMixin>{
    ...mapState(
        ['assetStore']),
    ...mapGetters(
        ['assetMetaData'])
}

const mutations: MutationTree<typeof state> = {
    [MutationTypes.UPDATE_ASSETS](state, payload: MutationTypes.PayloadUpdateAssets) {
        payload.assets.forEach(value => Vue.set(state.storage, value.id, value))
    },
    [MutationTypes.UPDATE_ASSET_RELATED_FILES](state, payload: MutationTypes.PayloadUpdateAssetRelatedFiles) {
        Vue.set(state.fileMap, payload.id, payload.files)
    },
    [MutationTypes.DELETE_ASSET](state, payload: MutationTypes.PayloadAssetID) {
        Vue.delete(state.storage, payload.id)
    }
}

const actions: ActionTree<typeof state, RootState> = {
    async [MutationTypes.UPDATE_ASSETS](context, payload: MutationTypes.PayloadCategoryID) {
        return axios
            .get(`/api/category/${payload.id}/assets`)
            .then(
                response => {
                    let data = <Array<ResponseAssetData>>response.data
                    let assets = (data).map(value => Asset.from_data(value));
                    let payload: MutationTypes.PayloadUpdateAssets = { assets }
                    context.commit(MutationTypes.UPDATE_ASSETS, payload)
                }
            )
    },
    async [MutationTypes.UPDATE_ASSET](context, payload: MutationTypes.PayloadAssetID) {
        return axios.get(`/api/asset/${payload.id}`).then(
            response => {
                let data = <ResponseAssetData>response.data
                let assets = [Asset.from_data(data)];
                let payload: MutationTypes.PayloadUpdateAssets = { assets }
                context.commit(MutationTypes.UPDATE_ASSETS, payload)
            }
        )
    },
    async [MutationTypes.EDIT_ASSET](context, payload: MutationTypes.PayloadEditAsset) {
        return axios.put(`/api/asset/${payload.id}`, payload.data).then(
            response => {
                let updatePayload: MutationTypes.PayloadAssetID = { id: payload.id }
                context.dispatch(MutationTypes.UPDATE_ASSET, updatePayload)
                return response
            }
        )
    },
    async [MutationTypes.ADD_ASSET](context, payload: MutationTypes.PayloadAddAsset) {
        return axios.post('/api/asset', payload).then(
            response => {
                let data = <ResponseAssetData>response.data
                let assets = [Asset.from_data(data)];
                let payload: MutationTypes.PayloadUpdateAssets = { assets }
                context.commit(MutationTypes.UPDATE_ASSETS, payload)
            }
        )
    },
    async [MutationTypes.DELETE_ASSET](context, payload: MutationTypes.PayloadAssetID) {
        return axios.delete(`/api/asset/${payload.id}`).then(
            response => {
                context.commit(MutationTypes.DELETE_ASSET, payload)
                return response
            }
        )
    }
}

const module: Module<typeof state, RootState> =
    {
        state,
        getters,
        mutations,
        actions
    }

export default module