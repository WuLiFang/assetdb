<template lang="pug">
  el-dialog(
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

import { Asset } from "../model";

import AssetFileTransfer from "./AssetFileTransfer.vue";

export default Vue.extend({
  props: { asset: { type: Asset }, visible: { default: false } },
  data() {
    return {
      selectedFiles: []
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
    }
  },
  components: {
    AssetFileTransfer
  }
});
</script>
<style lang="scss" scoped>
.asset-file-transfer {
  display: flex;
  justify-content: center;

}
</style>
