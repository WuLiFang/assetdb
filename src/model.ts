// TODO: Refactor `CategoryStorage`
import { ResponseAssetData, ResponseCategoryData, ResponseAssetFileData } from './interfaces';

export interface CategoryStorage {
    [id: string]: Category
}

export class Category {
    constructor(
        public id: string,
        public parent_id: string | null,
        public name: string,
        public path: string) {
    }
    static from_data(data: ResponseCategoryData) {
        return new Category(
            String(data.id),
            data.parent_id === null ? null : String(data.parent_id),
            data.name,
            data.path)
    }

}
export interface AssetStorage {
    [id: string]: Asset
}

export class Asset {
    public fileIDArray: Array<string> = []
    constructor(
        public id: string,
        public category_id: string,
        public name: string,
        public thumbnail_id: string | null,
        public description: string | null,
    ) {
    }
    static from_data(data: ResponseAssetData) {
        return new Asset(String(data.id), String(data.category_id), data.name, data.thumbnail_id, data.description)
    }
}

export interface AssetFileStorage {
    [id: string]: AssetFile
}
export class AssetFile {
    constructor(
        public id: string,
        public label: string,
        public path: string,
        public mimetype: string,
    ) { }
    static from_data(data: ResponseAssetFileData) {
        return new AssetFile(String(data.id), data.label, data.path, data.mimetype)
    }
}