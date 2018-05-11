import { Category, AssetFile, Asset, CategoryStorage, AssetStorage, AssetFileStorage } from "../model";

export interface IDMap<T> {
    [id: string]: T
}

export interface RouteURLMap extends IDMap<string> {
}

export interface CountMap extends IDMap<number | null> {

}
export interface RootState {
    root: string
}
export interface CategoryArrayMap extends IDMap<Array<Category>> {
}

export interface CategoryState {
    storage: CategoryStorage
    countMap: CountMap
}

export interface CategoryMetaData {
    childrenMap: CategoryArrayMap
    routeURLMap: RouteURLMap
    recurseCountMap: CountMap
    root: Category | undefined
}

export interface AssetState {
    storage: AssetStorage
}

export interface AssetMetaData {
    routeURLMap: RouteURLMap
}

export interface AssetFileState {
    storage: AssetFileStorage
}

export interface AssetFileMetaData {
    routeURLMap: RouteURLMap
}