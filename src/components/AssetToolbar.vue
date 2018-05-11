<template lang="pug">
  el-container
    el-button-group(class="toolbar")
      el-button(icon="el-icon-refresh" @click='updateFiles') 刷新
      el-button(icon="el-icon-edit" @click='isShowEditDialog = true' type="primary") 编辑
      el-button(icon="el-icon-delete" type="danger") 删除
    
    AssetEditDialog(:asset='asset' :visible.sync='isShowEditDialog')
</template>
<script lang="ts">
import Vue from "vue";

import axios from "axios";

import AssetEditDialog from "./AssetEditDialog.vue";

import { Asset, AssetFile } from "../model";
import { ResponseAssetData } from "../interfaces";
import * as mutations from "../mutation-types";

export default Vue.extend({
  props: {
    asset: { type: Asset }
  },
  data() {
    return {
      isShowEditDialog: false
    };
  },
  methods: {
    updateFiles() {
      let payload: mutations.PayloadAssetID = { id: this.asset.id };
      this.$store
        .dispatch(mutations.UPDATE_ASSET_RELATED_FILES, payload)
        .then(response => {
          this.$message({ message: "文件列表已刷新", type: "success" });
        })
        .catch(reason => {
          let message = String(reason);
          this.$notify({
            title: "获取资产列表失败",
            message,
            type: "error"
          });
        });
    }
  },
  components: {
    AssetEditDialog
  }
});
</script>
<style lang="scss" scoped>
.toolbar {
  display: flex;
  justify-content: flex-end;
  flex: 1;
}
</style>