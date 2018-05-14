<template lang="pug">
  el-card.file-card
    FileDisplay(:file='file')
    div {{file.name}}
</template>

<script lang="ts">
import Vue from "vue";

import axios from "axios";
import * as _ from "lodash";

import FileDisplay from "./FileDisplay.vue";

import { Asset, AssetFile } from "../model";
import { assetFileComputedMinxin } from "../store/asset-file";

export default Vue.extend({
  props: { file: { type: AssetFile } },
  computed: {
    ...assetFileComputedMinxin,
    routeURL(): string {
      return this.assetFileMetaData.routeURLMap[this.file.id];
    }
  },
  components: {
    FileDisplay
  }
});
</script>

<style lang="scss" scoped>
.file-card {
  div {
    display: inline-block;
  }
  margin: auto;
  margin-top: 3px;
  break-inside: avoid;
  word-wrap: break-word;
  margin-bottom: 10px;
  max-height: 100%;
  text-align: center;
  &:hover {
    .toolbar {
      visibility: visible;
      opacity: 1;
    }
  }
}
</style>
