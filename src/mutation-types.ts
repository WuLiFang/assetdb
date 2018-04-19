import { Category, Asset } from "./model";
// Category mutations.
export const UPDATE_CATEGORIES = 'update_categories'
export const UPDATE_ROOT = 'update_root'
export const ADD_CATEGORY = 'add_category'
export const EDIT_CATEGORY = 'edit_category'
export const COUNT_CATEGORY = 'count_category'
export const SET_CATEGORY = 'set_category'
export const DELETE_CATEGORY = 'delete_category'

export interface PayloadCategoryId {
    id: string
}
export interface PayloadEditCategory extends PayloadCategoryId {
    data: { name: string, parent_id: string }
}
export interface PayloadAddCategory {
    name: string, parent_id: string, path: string
}

export interface PayloadSetCategory extends PayloadCategoryId {
    count?: number | null
}

// Asset mutations.
export const LOAD_ASSETS = 'load_assets'
export const LOAD_ASSET = 'load_asset'
export const ADD_ASSET = 'add_asset'
export const DELETE_ASSET = 'delete_asset'
export const EDIT_ASSET = 'edit_asset'
export interface PayloadAssetId {
    id: string
}
export interface PayloadLoadAssets {
    assets: Array<Asset>
}
// TODO
export interface PayloadAddAsset {
    categoryID: string,
    name: string
}
export interface PayloadEditAsset {
    id: string,
    name?: string
}

export interface PayloadDeleteAsset {
    id: string
}