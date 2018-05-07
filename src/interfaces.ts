
export interface ResponseCategoryData {
    id: string,
    parent_id: string,
    name: string,
    path: string
}
export interface ResponseAssetData {
    id: string,
    category_id: string,
    thumbnail_id: string | null,
    name: string,
    description: string | null,
}