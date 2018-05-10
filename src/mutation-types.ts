import { Category, Asset, AssetFile } from "./model";
// Category mutations.
export const UPDATE_CATEGORIES = 'update_categories'
export const UPDATE_ROOT = 'update_root'
export const ADD_CATEGORY = 'add_category'
export const EDIT_CATEGORY = 'edit_category'
export const COUNT_CATEGORY = 'count_category'
export const SET_CATEGORY = 'set_category'
export const DELETE_CATEGORY = 'delete_category'

export interface PayloadCategoryID {
    id: number
}

export interface PayloadUpdateCategories {
    categories: Array<Category>
}
export interface PayloadEditCategory extends PayloadCategoryID {
    data: { name: string, parent_id: number }
}
export interface PayloadAddCategory {
    name: string, parent_id: number, path: string
}

export interface PayloadSetCategory extends PayloadCategoryID {
    count?: number | null
}

// Asset mutations.
export const UPDATE_ASSETS = 'update_assets'
export const UPDATE_ASSET = 'update_asset'
export const UPDATE_ASSET_RELATED_FILES = 'update_asset_related_files'
export const ADD_ASSET = 'add_asset'
export const DELETE_ASSET = 'delete_asset'
export const EDIT_ASSET = 'edit_asset'
export interface PayloadAssetID {
    id: number
}
export interface PayloadUpdateAssets {
    assets: Array<Asset>
}
export interface PayloadUpdateAssetRelatedFiles extends PayloadAssetID {
    files: Array<AssetFile>
}
export interface PayloadEditAsset extends PayloadAssetID {
    data: {
        category_id?: number
        name?: string
        files?: Array<number>
        description?: string
    }
}

// Asset file mutations
export const UPDATE_ASSET_FILES = 'update_asset_files'
export const UPDATE_ASSET_FILE = 'update_asset_file'
export const EDIT_ASSET_FILE = 'edit_asset_file'

export interface PayloadAssetFileID {
    id: number
}
export interface PayloadUpdateAssetFiles {
    files: Array<AssetFile>
}