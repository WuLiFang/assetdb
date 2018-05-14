<template lang="pug">
  .file-display(draggable @dragstart.stop="onDragStart($event)")
    video(v-if='srcURL' :src='srcURL' :poster='posterURL')
    img(v-else-if='posterURL' :src="posterURL" :style='style')
</template>

<script lang="ts">
import Vue from "vue";

import axios from "axios";
import * as _ from "lodash";

import { Asset, AssetFile } from "../model";
import { assetFileComputedMinxin } from "../store/asset-file";

export default Vue.extend({
  props: {
    file: { type: AssetFile },
    height: { type: String, default: "auto" },
    width: { type: String, default: "auto" }
  },
  computed: {
    ...assetFileComputedMinxin,
    style(): Object {
      return {
        height: this.height,
        width: this.width
      };
    },
    url(): string {
      return `/storage/id/${this.file.id}`;
    },
    posterURL(): string | null {
      return _.startsWith(this.file.mimetype, "image/") ? this.url : null;
    },
    srcURL(): string | null {
      return _.startsWith(this.file.mimetype, "video/") ? this.url : null;
    },
    fileURL(): string {
      return `${this.$store.state.root}/${this.file.path}`;
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
.file-display {
  img {
    width: 100%;
  }
}
</style>
