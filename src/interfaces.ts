// Date interface for backend.
export interface ResponseCategoryData {
    id: number,
    parent_id: number | null,
    name: string,
    path: string
}
export interface ResponseAssetData {
    id: number,
    category_id: number,
    thumbnail_id: string | null,
    name: string,
    description: string | null,
}
export interface ResponseAssetFileData {
    id: number,
    label: string,
    path: string,
    mimetype: string
}