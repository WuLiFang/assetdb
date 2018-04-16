<template lang="pug">
  div(class="card")
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
.card {
  width: 200px;
  word-wrap: break-word;
  border: 1px solid black;
  margin: 10px;
  img {
    width: 100%;
  }
}
</style>
