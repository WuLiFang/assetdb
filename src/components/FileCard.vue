<template lang="pug">
  el-card.file-card
    FileDisplay(:file='file' width='100%' height="100%")
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
  display: inline-block;
  margin: auto;
  margin: 5px;
  break-inside: avoid;
  word-wrap: break-word;
  text-align: center;
}
</style>
