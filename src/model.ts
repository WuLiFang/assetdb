export class CategoryStorage extends Array<Category>{
    select(id: string) {
        return this.filter(
            (value) => { return value.id == id }
        )[0]
    }
}
export class Category {
    constructor(
        public id: string,
        public parent_id: string,
        public name: string,
        public path: string) {
    }
    url(): string {
        return `/category/${this.id}/${this.name}`
    }
    isTopLevel(): boolean {
        return !this.parent_id
    }
    static from_data(data: Array<string>) {
        return new Category(data[0], data[1], data[2], data[3])
    }
}