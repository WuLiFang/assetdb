<template lang="pug">
  el-card
    img(:src="preview_url")
    div {{asset.name}}
</template>

<script lang="ts">
import Vue from "vue";
import { Asset } from "../model";
export default Vue.extend({
  props: { asset: { type: Asset } },
  computed: {
    preview_url(): string {
      return `/storage/${this.asset.path}`;
    }
  }
});
</script>

<style lang="scss" scoped>
.el-card {
  break-inside: avoid;
  word-wrap: break-word;
  margin-bottom: 10px;
  img {
    width: 100%;
  }
}
</style>
