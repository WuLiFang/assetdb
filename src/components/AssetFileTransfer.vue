<template lang="pug">
  el-transfer.asset-file-transfer(
    v-model='computedSelected'
    :data='data'
    :titles="['全部文件', '当前文件']"
    filterable
  )
</template>

<script lang="ts">
import Vue from "vue";

import * as _ from "lodash";
import { ElTransfer } from "element-ui/types/transfer";

import { Asset } from "../model";
import * as mutations from "../mutation-types";
import { assetFileComputedMinxin } from "../store/asset-file";

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
    computedSelected: {
      get: function(): Array<string> {
        return this.selected;
      },
      set: function(value: Array<string>) {
        this.$emit("update:selected", value);
      }
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