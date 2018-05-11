import { Module, MutationTree, ActionTree, mapState, GetterTree, mapGetters } from 'vuex';
import { DefaultComputed } from "vue/types/options";

import * as _ from "lodash";
import axios from "axios";

import { ResponseAssetData, } from '../interfaces';
import { Asset, AssetStorage } from "../model";
import * as MutationTypes from "../mutation-types";
import { RootState, AssetState, AssetMetaData, RouteURLMap } from './types'

export const state: AssetState = {
    storage: {},
}

const getters: GetterTree<AssetState, RootState> = {
    assetMetaData(state): AssetMetaData {
        let routeURLMap: RouteURLMap = {}
        _.each(state.storage, i => routeURLMap[i.id] = `/asset/${i.id}/${i.name}`)
        return {
            routeURLMap
        }

    }
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
        payload.assets.forEach(value => state.storage[value.id] = value)
        state.storage = { ...state.storage }
    },
    [MutationTypes.UPDATE_ASSET_RELATED_FILES](state, payload: MutationTypes.PayloadUpdateAssetRelatedFiles) {
        let asset = state.storage[payload.id]
        if (!asset) {
            console.warn(`Asset not found, id: ${payload.id}`)
            return
        }
        asset.files = payload.files
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

}

const module: Module<typeof state, RootState> =
    {
        state,
        getters,
        mutations,
        actions
    }

export default module