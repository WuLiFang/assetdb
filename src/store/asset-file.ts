import { Module, MutationTree, ActionTree } from 'vuex';

import axios from "axios";

import { ResponseAssetFileData } from '../interfaces';
import { AssetFileStorage, AssetFile } from "../model";
import * as MutationTypes from "../mutation-types";
import { RootState } from './types'

export const state: AssetFileStorage = {
}

const mutations: MutationTree<typeof state> = {
    [MutationTypes.UPDATE_ASSET_FILES](state, payload: MutationTypes.PayloadUpdateAssetFiles) {
        payload.files.forEach(value => state[value.id] = value)
    },
}

const actions: ActionTree<typeof state, RootState> = {
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

const module: Module<typeof state, RootState> =
    {
        state,
        mutations,
        actions
    }

export default module