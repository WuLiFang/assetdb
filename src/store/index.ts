import Vue from "vue";
import Vuex, { StoreOptions } from 'vuex';

import axios from "axios";

import * as mutations from "../mutation-types";

import category from './category';
import asset from './asset';
import assetFile from './asset-file';
import { RootState } from './types'


const store: StoreOptions<RootState> =
    {
        strict: process.env.NODE_ENV !== 'production',
        state: {
            root: '',
        },
        mutations: {
            [mutations.UPDATE_ROOT](state, payload) {
                state.root = <string>payload.root
            },
        },
        actions: {
            async [mutations.UPDATE_ROOT](context) {
                return axios.get(`/api/root?platform=${window.navigator.platform}`).then(
                    response => {
                        context.commit(mutations.UPDATE_ROOT, { root: response.data })
                    }
                )
            },
        },
        modules: {
            category,
            asset,
            assetFile
        },
    }

export default store
