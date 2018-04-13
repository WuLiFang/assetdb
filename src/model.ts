export class CategoryStorage extends Array<Category>{ }
export class Category {
    constructor(
        public id: string,
        public parent_id: string,
        public name: string,
        public path: string) {
    }
    url = (): string => {
        return `/category/${this.id}/${this.name}`
    }
    isTopLevel = (): boolean => {
        return !this.parent_id
    }
    static from_data(data: Array<string>) {
        return new Category(data[0], data[1], data[2], data[3])
    }
}
export class Asset {
    constructor(
        public id: string,
        public category_id: string,
        public name: string,
        public path: string,
        public mimetype: string,
        public description: string,
    ) {
    }
    static from_data(data: Array<string>) {
        return new Asset(data[0], data[1], data[2], data[3], data[4], data[5])
    }
}