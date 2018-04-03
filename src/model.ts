export let categoryStorage: Array<Category> = []
export class Category {
    constructor(public id: string, public parent_id = '', public name: string, public path: string) {
        categoryStorage.push(this)
    }
    static from_data(data: Array<string>) {
        return new Category(data[0], data[1], data[2], data[3])
    }
    static from_id(id: string) {
        let ret = categoryStorage.filter((value) => { return value.id == id })[0]
        if (ret) {
            return ret
        }
        throw new Error('No such category')
    }
}