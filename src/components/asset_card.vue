<template lang="pug">
  el-card
    img(:src="preview_url" @dragstart.capture="onDragStart($event)")
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
    },
    fileURL(): string {
      return `${this.$store.state.root}/${this.asset.path}`;
    }
  },
  methods: {
    onDragStart(ev: DragEvent) {
      ev.dataTransfer.setData("text/plain", this.fileURL);
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
