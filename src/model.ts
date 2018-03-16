export class Category {
    constructor(public id: string, public parent_id: string, public name: string, public path: string) {
    }
    static from_data(data: Array<string>) {
        return new Category(data[0], data[1], data[2], data[3])
    }
}