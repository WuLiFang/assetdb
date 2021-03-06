<template lang="pug">
  el-dialog.asset-edit-dialog(
    title="编辑资产"
    :visible='visible'
    v-on='$listeners'
    fullscreen
  )
    el-form(v-model='form' label-width='80px')
      el-form-item(label='名称')
        el-input(v-model='asset.name')
      el-form-item(label='描述')
        el-input(v-model='asset.description')
      el-form-item(label='文件')
        AssetFileTransfer(:asset='asset' :selected.sync='selectedFiles')
    span(slot='footer')
      el-button(@click='reject') 取消
      el-button(@click='accept' type='primary') 确定
</template>
<script lang="ts">
import Vue from "vue";

import AssetFileTransfer from "./AssetFileTransfer.vue";

import { Asset, AssetFile } from "../model";
import * as mutations from "../mutation-types";
import { assetComputedMinxin } from "../store/asset";
import {
  PayloadUpdateAssetRelatedFiles,
  UPDATE_ASSET_RELATED_FILES,
  EDIT_ASSET,
  PayloadEditAsset
} from "../mutation-types";
import { assetFileComputedMinxin } from "../store/asset-file";
import { file } from "babel-types";

export default Vue.extend({
  props: { asset: { type: Asset }, visible: { default: false } },
  data() {
    return {
      form: {}
    };
  },
  computed: {
    ...assetComputedMinxin,
    ...assetFileComputedMinxin,
    selectedFiles: {
      get(): Array<string> {
        return (this.assetStore.fileMap[this.asset.id] || []).map(
          value => value.id
        );
      },
      set(value: Array<string>) {
        let payload: PayloadUpdateAssetRelatedFiles = {
          id: this.asset.id,
          files: value.map(i => this.assetFileStore.storage[i])
        };
        this.$store.commit(UPDATE_ASSET_RELATED_FILES, payload);
      }
    }
  },
  methods: {
    close() {
      this.$emit("update:visible", false);
    },
    accept() {
      console.log(this.selectedFiles);
      let payload: PayloadEditAsset = {
        id: this.asset.id,
        data: {
          name: this.asset.name,
          category_id: this.asset.category_id,
          description: this.asset.description,
          files: this.selectedFiles
        }
      };
      this.$store
        .dispatch(EDIT_ASSET, payload)
        .then(() => {
          this.$message({ message: "编辑成功", type: "success" });
        })
        .catch(err => this.$message({ message: String(err), type: "error" }));
      this.close();
    },
    reject() {
      this.close();
    },
    updateData() {
      let payload: mutations.PayloadAssetID = { id: this.asset.id };
      this.$store.dispatch(mutations.UPDATE_ASSET_RELATED_FILES, payload);
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
      .el-form {
        @include column-flex;
        .el-form-item {
          flex: 0;
          &:nth-child(3) {
            flex: 1;
            position: relative;
            @include column-flex;
            .el-form-item__content {
              @include column-flex;
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
            }
          }
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
