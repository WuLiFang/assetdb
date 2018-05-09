<template lang="pug">
  //- router-link.file-card(:to="routeURL")
  .file-card
    el-card
      .display(draggable @dragstart.stop="onDragStart($event)")
        video(v-if='srcURL' :src='srcURL' :poster='posterURL')
        img(v-else-if='posterURL' :src="posterURL")
      div {{file.name}}
</template>

<script lang="ts">
import Vue from "vue";

import axios from "axios";
import * as _ from "lodash";

import { Asset, AssetFile } from "../model";
import FileUtil from "../file-util";

export default Vue.extend({
  props: { file: { type: AssetFile } },
  data() {
    return { isDeleted: false, FileUtil };
  },
  computed: {
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
    },
    routeURL(): string {
      return FileUtil.routeURL(this.file);
    }
  },
  methods: {
    onDragStart(ev: DragEvent) {
      console.log(ev);
      ev.dataTransfer.setData("text/plain", this.fileURL);
    }
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
  .el-card {
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
}
</style>
