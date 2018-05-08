import { Asset, AssetStorage, AssetFile, AssetFileStorage } from "./model";
import store from "./store";
import * as _ from "lodash";

export default class FileUtil {
    static get storage(): AssetFileStorage {
        return store.state.files
    }
    static routeURL(file: AssetFile): string {
        return `/file/${file.id}/${file.label}`
    }
    static get(id: string): AssetFile | undefined {
        return _.get(FileUtil.storage, id)
    }
}