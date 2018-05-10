import { Category, AssetFile, Asset, CategoryStorage, AssetStorage, AssetFileStorage } from "../model";

export interface RootState {
    root: string
}

export interface CategoryState {
    storage: CategoryStorage
}
export interface IDMap<T> {
    [id: number]: T
}

export interface CategoryChildrenMap extends IDMap<Array<Category>> {
}

export interface CategoryRouteURLMap extends IDMap<string> {
}

export interface CategoryRecurseCountMap extends IDMap<number> {

}

export interface CategoryMetaData {
    childrenMap: CategoryChildrenMap
    routeURLMap: CategoryRouteURLMap
    recurseCountMapp: CategoryRecurseCountMap
    root: Category | undefined
}

export interface AssetState {
    storage: AssetStorage
}

export interface AssetFileState {
    storage: AssetFileStorage
}