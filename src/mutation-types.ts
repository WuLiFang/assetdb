import { Category } from "./model";

export const UPDATE_CATEGORIES = 'update_categories'
export const UPDATE_ROOT = 'update_root'
export const ADD_CATEGORY = 'add_category'
export const EDIT_CATEGORY = 'edit_category'
export const COUNT_CATEGORY = 'count_category'

export interface PayloadEditCategory {
    id: string,
    data: { name: string, parent_id: string }
}
export interface PayloadAddCategory {
    name: string, parent_id: string
}
export interface PayloadDeleteCategory {
    id: string
}
export interface PayloadCountCategoryAssets {
    id: string
}