import { Category, AssetFile, Asset, CategoryStorage, AssetStorage, AssetFileStorage } from "../model";

export interface IDMap<T> {
    [id: string]: T
}

export type RouteURLMap = IDMap<string>
export type CountMap = IDMap<number | null>
export type CategoryArrayMap = IDMap<Array<Category>>


export interface RootState {
    root: string
}

export interface CategoryState {
    storage: CategoryStorage
    countMap: CountMap
}

export interface AssetState {
    storage: AssetStorage
}
export interface AssetFileState {
    storage: AssetFileStorage
}

export interface CombinedRootState extends RootState {
    categoryStore: CategoryState
    assetStore: AssetState
    assetFileStore: AssetFileState
}


export interface CategoryMetaData {
    childrenMap: CategoryArrayMap
    routeURLMap: RouteURLMap
    recurseCountMap: CountMap
    root: Category | undefined
}

export interface AssetMetaData {
    routeURLMap: RouteURLMap
}


export interface AssetFileMetaData {
    routeURLMap: RouteURLMap
}