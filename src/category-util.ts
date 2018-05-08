import { Category, CategoryStorage } from "./model";
import store from "./store";
import * as _ from "lodash";

export default class CategoryUtil {
    static get categories(): CategoryStorage {
        return store.state.categories
    }
    static url(category: Category): string {
        return `/category/${category.id}/${category.name}`
    }
    static isTopLevel(category: Category): boolean {
        return !category.parent_id
    }
    static isLegalParent(category: Category, parent: Category): boolean {
        let grandparent = this.getCategory(parent.parent_id)
        return (
            parent.id != category.id &&
            (grandparent ? this.isLegalParent(category, grandparent) : true)
        );
    }
    static getRelated(category: Category): Category[] {
        let ret: Category[] = [];
        let parent_id: number;
        let parent: Category | undefined;
        let current = category

        while (current) {
            ret.push(current);
            parent_id = current.parent_id;
            parent = this.getCategory(parent_id)
            if (!parent) {
                break
            }
            current = parent;
        }
        ret.reverse();
        return ret;
    }
    static getCategory(id: number): Category | undefined {
        return _.find(this.categories, value => value.id == id);
    }
    static getChildren(category: Category): Category[] {
        return _.filter(this.categories, value => value.parent_id == category.id)
    }
    static getRecurseCount(category: Category): number {
        let count = category.count ? category.count : 0
        return this.getChildren(category).reduce((prev, current) => prev + this.getRecurseCount(current), count)
    }
}
