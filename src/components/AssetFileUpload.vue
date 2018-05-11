<template lang="pug">
  el-upload(
      action='api/file'
      :data='data'
      :on-success='onSuccess'
      :on-error='onError'
      drag
      multiple
  ) 上传新文件
</template>

<script lang="ts">
import Vue from "vue";

import { Asset, AssetFile } from "../model";
import { categoryComputedMinxin } from "../store/category";
import { assetComputedMinxin } from "../store/asset";
import { ResponseAssetFileData } from "../interfaces";
import {
  UPDATE_ASSET_FILES,
  PayloadUpdateAssetFiles,
  UPDATE_ASSET_RELATED_FILES,
  PayloadUpdateAssetRelatedFiles
} from "../mutation-types";

export default Vue.extend({
  props: {
    asset: { type: Asset }
  },
  computed: {
    ...categoryComputedMinxin,
    ...assetComputedMinxin,
    data() {
      let path: string = this.categoryStore.storage[this.asset.category_id]
        .path;
      return {
        path
      };
    },
    uploadListeners(): Vue["$listeners"] {
      return this.$listeners;
    }
  },
  methods: {
    onSuccess(
      response: ResponseAssetFileData,
      file: string,
      fileList: string[]
    ) {
      let createdFile = AssetFile.from_data(response);
      let payload: PayloadUpdateAssetFiles = { files: [createdFile] };
      this.$store.commit(UPDATE_ASSET_FILES, payload);
      this.$emit("uploaded", createdFile);
    },
    onError(err: any, file: string, fileList: string[]) {
      this.$message({ message: String(err), type: "error" });
    }
  }
});
</script>
