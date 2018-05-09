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
import FileUtil from "../file-util";
import * as mutations from "../mutation-types";

export default Vue.extend({
  props: {
    asset: { type: Asset },
    selected: { type: <() => Array<number>>Array }
  },
  data() {
    return {
      data: <ElTransfer["data"]>[]
    };
  },
  computed: {
    computedSelected: {
      get: function(): Array<Number> {
        return this.selected;
      },
      set: function(value: Array<Number>) {
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
      let storage = FileUtil.storage;
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