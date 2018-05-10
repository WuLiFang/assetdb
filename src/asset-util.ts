import { Asset, AssetStorage, AssetFile } from "./model";
import { state } from "./store/asset";
import * as _ from "lodash";

export default class AssetUtil {
    static get storage(): AssetStorage {
        return state.storage
    }
    static url(asset: Asset): string {
        return `/asset/${asset.id}/${asset.name}`
    }
    static get(id: string): Asset | null {
        return _.get(this.storage, id, null)
    }
}