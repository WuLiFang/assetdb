import { Category, Asset, AssetFile } from "./model";
// Category mutations.
export const UPDATE_CATEGORIES = 'update_categories'
export const UPDATE_ROOT = 'update_root'
export const ADD_CATEGORY = 'add_category'
export const EDIT_CATEGORY = 'edit_category'
export const COUNT_CATEGORY = 'count_category'
export const SET_CATEGORY = 'set_category'
export const DELETE_CATEGORY = 'delete_category'

export interface PayloadCategoryId {
    id: number
}
export interface PayloadEditCategory extends PayloadCategoryId {
    data: { name: string, parent_id: number }
}
export interface PayloadAddCategory {
    name: string, parent_id: number, path: string
}

export interface PayloadSetCategory extends PayloadCategoryId {
    count?: number | null
}

// Asset mutations.
export const LOAD_ASSETS = 'load_assets'
export const LOAD_ASSET = 'load_asset'
export const UPDATE_ASSET_FILES = 'update_asset_files'
export const ADD_ASSET = 'add_asset'
export const DELETE_ASSET = 'delete_asset'
export const EDIT_ASSET = 'edit_asset'
export interface PayloadAssetId {
    id: number
}
export interface PayloadLoadAssets {
    assets: Array<Asset>
}
export interface PayloadUpdateAssetFiles extends PayloadAssetId {
    files: Array<AssetFile>
}

// Asset file mutations

export const LOAD_ASSET_FILES = 'load_asset_files'

export interface PayloadLoadAssetFiles {
    files: Array<AssetFile>
}