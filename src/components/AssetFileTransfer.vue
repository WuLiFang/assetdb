<template lang="pug">
  el-transfer.asset-file-transfer(
    v-model='computedSelected'
    :data='data'
    :titles="['全部文件', '当前文件']"
    filterable
  )
    AssetFileUpload.right-footer(
      slot='right-footer'
      :asset='asset'
      @uploaded='add'
    )
</template>

<script lang="ts">
import Vue from "vue";

import * as _ from "lodash";
import { ElTransfer } from "element-ui/types/transfer";

import { Asset, AssetFile } from "../model";
import * as mutations from "../mutation-types";
import { assetFileComputedMinxin } from "../store/asset-file";
import { categoryComputedMinxin } from "../store/category";
import AssetFileUpload from "./AssetFileUpload.vue";

export default Vue.extend({
  props: {
    asset: { type: Asset },
    selected: { type: <() => Array<string>>Array }
  },
  data() {
    return {};
  },
  computed: {
    ...assetFileComputedMinxin,
    ...categoryComputedMinxin,
    data(): ElTransfer["data"] {
      let storage = this.assetFileStore.storage;
      return _.map(storage, value => ({
        label: value.label,
        key: value.id,
        disabled: false
      }));
    },
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
    add(file: AssetFile) {
      let newValue = this.computedSelected;
      newValue.push(file.id);
      this.$emit("update:selected", newValue);
    },
    updateFiles() {
      this.$store.dispatch(mutations.UPDATE_ASSET_FILES);
    }
  },
  mounted() {
    this.updateFiles();
  },
  components: {
    AssetFileUpload
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
