import Vue from 'vue';
import { Module, MutationTree, ActionTree, GetterTree, mapState, mapGetters } from 'vuex';
import { DefaultComputed } from "vue/types/options";

import axios from "axios";
import * as _ from "lodash";

import { ResponseAssetFileData } from '../interfaces';
import { AssetFileStorage, AssetFile } from "../model";
import * as MutationTypes from "../mutation-types";
import { RootState, AssetFileMetaData, AssetFileState, RouteURLMap } from './types'

export const state: AssetFileState = {
    storage: {}
}

const getters: GetterTree<AssetFileState, RootState> = {
    assetFileMetaData(state): AssetFileMetaData {
        let routeURLMap: RouteURLMap = {}
        _.each(state.storage, i => routeURLMap[i.id] = `/file/${i.id}/${i.label}`)
        return {
            routeURLMap
        }

    }
}
interface AssetFileComputedMixin extends DefaultComputed {
    assetFileStore: () => AssetFileState
    assetFileMetaData: () => AssetFileMetaData
}

export const assetFileComputedMinxin = <AssetFileComputedMixin>{
    ...mapState(
        ['assetFileStore']),
    ...mapGetters(
        ['assetFileMetaData'])
}

const mutations: MutationTree<AssetFileState> = {
    [MutationTypes.UPDATE_ASSET_FILES](state, payload: MutationTypes.PayloadUpdateAssetFiles) {
        payload.files.forEach(value => Vue.set(state.storage, value.id, value))
    },
}

const actions: ActionTree<AssetFileState, RootState> = {
    async [MutationTypes.UPDATE_ASSET_FILES](context) {
        return axios.get('/api/file').then(
            response => {
                let data = <Array<ResponseAssetFileData>>response.data
                let files = data.map(value => AssetFile.from_data(value))
                let payload: MutationTypes.PayloadUpdateAssetFiles = { files }
                context.commit(MutationTypes.UPDATE_ASSET_FILES, payload)
            }
        )
    },
    async [MutationTypes.UPDATE_ASSET_FILE](context, payload: MutationTypes.PayloadAssetFileID) {
        return axios.get(`/api/file/${payload.id}`).then(
            response => {
                let data = <ResponseAssetFileData>response.data
                let files = [AssetFile.from_data(data)]
                let files_payload: MutationTypes.PayloadUpdateAssetFiles = { files }
                context.commit(MutationTypes.UPDATE_ASSET_FILES, files_payload)
            }
        )
    },
    async [MutationTypes.UPDATE_ASSET_RELATED_FILES](context, payload: MutationTypes.PayloadAssetID) {
        return axios.get(`/api/asset/${payload.id}/files`).then(
            response => {
                let data = <Array<ResponseAssetFileData>>response.data
                let files = data.map(value => AssetFile.from_data(value))
                let files_payload: MutationTypes.PayloadUpdateAssetFiles = { files }
                context.commit(MutationTypes.UPDATE_ASSET_FILES, files_payload)
                let asset_payload: MutationTypes.PayloadUpdateAssetRelatedFiles = { id: payload.id, files }
                context.commit(MutationTypes.UPDATE_ASSET_RELATED_FILES, asset_payload)
            }
        )
    },
}

const module: Module<AssetFileState, RootState> =
    {
        state,
        getters,
        mutations,
        actions
    }

export default module