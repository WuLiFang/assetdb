import { Category } from "./model";

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