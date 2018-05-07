// TODO: Refactor `CategoryStorage`
import { ResponseAssetData, ResponseCategoryData } from './interfaces';
export class CategoryStorage extends Array<Category>{ }

export class Category {
    public count: number | null = null;
    constructor(
        public id: string,
        public parent_id: string,
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
    constructor(
        public id: string,
        public category_id: string,
        public name: string,
        public thumbnail_id: string | null,
        public description: string | null,
    ) {
    }
    static from_data(data: ResponseAssetData) {
        return new Asset(data.id, data.category_id, data.name, data.thumbnail_id, data.description)
    }
}