<template lang="pug">
  router-link(:to="routeURL")
    el-card
      img(v-if='thumbnailURL' :src="thumbnailURL" @dragstart.capture="onDragStart($event)")
      div {{asset.name}}
</template>

<script lang="ts">
import Vue from "vue";

import axios from "axios";

import { Asset } from "../model";
import { assetComputedMinxin } from "../store/asset";

export default Vue.extend({
  props: { asset: { type: Asset } },
  data() {
    return { isDeleted: false };
  },
  computed: {
    ...assetComputedMinxin,
    routeURL(): string {
      return this.assetMetaData.routeURLMap[this.asset.id];
    },
    thumbnailURL(): string | null {
      let id = this.asset.thumbnail_id;
      if (!id) {
        return null;
      }
      return `/storage/id/${id}`;
    },
    fileURL(): string {
      return `${this.$store.state.root}/${this.asset.thumbnail_id}`;
    }
  },
  methods: {
    onDragStart(ev: DragEvent) {
      ev.dataTransfer.setData("text/plain", this.fileURL);
    },
    deleteAsset() {
      this.$confirm("确定要删除此资产?(不可撤销)", `资产: ${this.asset.name}`, {
        type: "warning"
      })
        .then(() => {
          axios
            .delete(`/api/asset/${this.asset.id}`)
            .then(() => {
              this.$message({ message: "删除成功", type: "success" });
              this.isDeleted = true;
            })
            .catch(error => {
              this.$notify({
                title: "删除失败",
                message: error.response.data,
                type: "success"
              });
            });
        })
        .catch(() => {
          this.$message("取消删除操作");
        });
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
