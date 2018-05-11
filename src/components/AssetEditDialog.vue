<template lang="pug">
  el-dialog.asset-edit-dialog(
    :visible='visible'
    v-on='$listeners'
    fullscreen
  )
    AssetFileTransfer(:asset='asset' :selected.sync='selectedFiles')
    span(slot='footer')
      el-button(@click='reject') 取消
      el-button(@click='accept' type='primary') 确定
</template>
<script lang="ts">
import Vue from "vue";

import AssetFileTransfer from "./AssetFileTransfer.vue";

import { Asset } from "../model";
import * as mutations from "../mutation-types";

export default Vue.extend({
  props: { asset: { type: Asset }, visible: { default: false } },
  data() {
    return {
      selectedFiles: <Array<string>>[]
    };
  },
  methods: {
    close() {
      this.$emit("update:visible", false);
    },
    accept() {
      console.log(this.selectedFiles);
      this.close();
    },
    reject() {
      this.close();
    },
    updateData() {
      let payload: mutations.PayloadAssetID = { id: this.asset.id };
      this.$store
        .dispatch(mutations.UPDATE_ASSET_RELATED_FILES, payload)
        .then(() => {
          this.selectedFiles = this.asset.files.map(value => value.id);
        });
    }
  },
  mounted() {
    this.updateData();
  },
  components: {
    AssetFileTransfer
  }
});
</script>

<style lang="scss">
@mixin column-flex {
  display: flex;
  flex-flow: column;
  flex: auto;
}
.asset-edit-dialog {
  .el-dialog {
    @include column-flex;
    .el-dialog__body {
      @include column-flex;
      .asset-file-transfer {
        display: flex;
        flex: auto;
        justify-content: center;
        .el-transfer-panel {
          @include column-flex;
          .el-transfer-panel__body {
            @include column-flex;
            .el-transfer-panel__list {
              @include column-flex;
            }
          }
        }
      }
    }
    .el-transfer__buttons {
      display: flex;
      flex-flow: column;
      justify-content: center;
    }
  }
}
</style>
