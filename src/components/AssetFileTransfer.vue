<template lang="pug">
  el-transfer.asset-file-transfer(
    v-model='computedSelected'
    :data='data'
    :titles="['全部文件', '当前文件']"
    filterable
  )
    el-upload.right-footer(
      slot='right-footer'
      action='api/file'
      :data='uploadData'
    ) 上传新文件
</template>

<script lang="ts">
import Vue from "vue";

import * as _ from "lodash";
import { ElTransfer } from "element-ui/types/transfer";

import { Asset } from "../model";
import * as mutations from "../mutation-types";
import { assetFileComputedMinxin } from "../store/asset-file";
import { categoryComputedMinxin } from "../store/category";

export default Vue.extend({
  props: {
    asset: { type: Asset },
    selected: { type: <() => Array<string>>Array }
  },
  data() {
    return {
      data: <ElTransfer["data"]>[]
    };
  },
  computed: {
    ...assetFileComputedMinxin,
    ...categoryComputedMinxin,
    computedSelected: {
      get: function(): Array<string> {
        return this.selected;
      },
      set: function(value: Array<string>) {
        this.$emit("update:selected", value);
      }
    },
    uploadData() {
      let path: string = this.categoryStore.storage[this.asset.category_id]
        .path;
      return {
        path
      };
    }
  },
  methods: {
    updateFiles() {
      this.$store
        .dispatch(mutations.UPDATE_ASSET_FILES)
        .then(() => (this.data = this.getData()));
    },
    getData(): ElTransfer["data"] {
      let storage = this.assetFileStore.storage;
      return _.map(storage, value => ({
        label: value.label,
        key: value.id,
        disabled: false
      }));
    }
  },
  mounted() {
    this.updateFiles();
  }
});
</script>

<style lang="scss" scoped>
.asset-file-transfer {
  .right-footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
