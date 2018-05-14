<template lang="pug">
  el-table(:data='tableData')
    el-table-column(label='缩略图' width='100')
      template(slot-scope="scope")
        el-popover(trigger='hover')
          el-button(type='primary' @click='setThumb(scope.row.file)') 设为缩略图
          FileDisplay(:file='scope.row.file' height='4em' slot='reference')
    el-table-column(label='标签' prop='label'  sortable)
    //- el-table-column(label='大小' prop='size' sortable)
    el-table-column(label='类型' prop='mimetype' width="120" sortable)
    el-table-column(label='路径' prop='path' sortable)
</template>
<script lang="ts">
import Vue from "vue";

import FileDisplay from "./FileDisplay.vue";

import { Asset, AssetFile } from "../model";
import { assetComputedMinxin } from "../store/asset";
import { EDIT_ASSET, PayloadEditAsset } from "../mutation-types";

export default Vue.extend({
  props: { asset: { type: Asset } },
  computed: {
    ...assetComputedMinxin,
    tableData(): tableRowData[] {
      let files = this.assetStore.fileMap[this.asset.id] || [];
      return files.map(value => ({
        file: value,
        label: value.label,
        // size: 0,
        mimetype: value.mimetype,
        path: value.path
      }));
    }
  },
  methods: {
    setThumb(file: AssetFile) {
      let payload: PayloadEditAsset = {
        id: this.asset.id,
        data: { thumbnail_id: file.id }
      };
      this.$store
        .dispatch(EDIT_ASSET, payload)
        .then(response => {
          this.$message({ message: response.data, type: "success" });
        })
        .catch(error => {
          this.$message({
            message: error.response ? error.response.data : String(error),
            type: "error"
          });
        });
    }
  },
  components: {
    FileDisplay
  }
});
interface tableRowData {
  label: string;
  size?: number;
  mimetype: string;
  path: string;
}
</script>
