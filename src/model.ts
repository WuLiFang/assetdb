// TODO: Refactor `CategoryStorage`
import { ResponseAssetData, ResponseCategoryData, ResponseAssetFileData } from './interfaces';

export interface CategoryStorage {
    [id: string]: Category
}

export class Category {
    public count: number | null = null;
    constructor(
        public id: number,
        public parent_id: number,
        public name: string,
        public path: string) {
    }
    static from_data(data: ResponseCategoryData) {
        return new Category(data.id, data.parent_id, data.name, data.path)
    }

}
export interface AssetStorage {
    [id: string]: Asset
}

export class Asset {
    public files: Array<AssetFile> = []
    constructor(
        public id: number,
        public category_id: number,
        public name: string,
        public thumbnail_id: string | null,
        public description: string | null,
    ) {
    }
    static from_data(data: ResponseAssetData) {
        return new Asset(data.id, data.category_id, data.name, data.thumbnail_id, data.description)
    }
}

export interface AssetFileStorage {
    [id: string]: AssetFile
}
export class AssetFile {
    constructor(
        public id: number,
        public label: string,
        public path: string,
        public mimetype: string,
    ) { }
    static from_data(data: ResponseAssetFileData) {
        return new AssetFile(data.id, data.label, data.path, data.mimetype)
    }
}