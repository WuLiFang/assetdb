import { Asset, AssetStorage } from "./model";
import store from "./store";
import * as _ from "lodash";

export default class AssetUtil {
    static get storage(): AssetStorage {
        return store.state.assets
    }
    static url(asset: Asset): string {
        return `/asset/${asset.id}/${asset.name}`
    }
    static get(id: string): Asset | null {
        return _.get(store.state.assets, id, null)
    }
}