<template lang="pug">
  el-dialog(
    :visible='visible'
    v-on='$listeners'
  )
    AssetFileTransfer(:asset='asset')
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
  methods: {
    close() {
      this.$emit("update:visible", false);
    },
    accept() {
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
