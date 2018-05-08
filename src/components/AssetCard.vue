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
import AssetUtil from "../asset-util";

export default Vue.extend({
  props: { asset: { type: Asset } },
  data() {
    return { isDeleted: false, AssetUtil };
  },
  computed: {
    routeURL(): string {
      return AssetUtil.url(this.asset);
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
  &:hover {
    .toolbar {
      visibility: visible;
      opacity: 1;
    }
  }
}
.toolbar-container {
  width: 100%;
}
.toolbar {
  visibility: hidden;
  position: absolute;
  opacity: 0;
  transition: ease-in 0.3s;
  .el-button {
    text-align: right;
  }
}
</style>
