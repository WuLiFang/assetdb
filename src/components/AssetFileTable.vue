<template lang="pug">
  el-table(:data='tableData')
    el-table-column(label='标签' prop='label'  sortable)
    el-table-column(label='大小' prop='size' sortable)
    el-table-column(label='类型' prop='mimetype' width="120" sortable)
    el-table-column(label='路径' prop='path' sortable)
</template>
<script lang="ts">
import Vue from "vue";

import { Asset } from "../model";
import { assetComputedMinxin } from "../store/asset";

export default Vue.extend({
  props: { asset: { type: Asset } },
  computed: {
    ...assetComputedMinxin,
    tableData(): tableRowData[] {
      let files = this.assetStore.fileMap[this.asset.id] || [];
      return files.map(value => ({
        label: value.label,
        // size: 0,
        mimetype: value.mimetype,
        path: value.path
      }));
    }
  }
});
interface tableRowData {
  label: string;
  size?: number;
  mimetype: string;
  path: string;
}
</script>
