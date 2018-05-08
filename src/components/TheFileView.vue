<template lang="pug">
  div(v-if="file")
    FileCard(:file="file" :key='file.id')
  div(v-else v-loading="isLoading") {{placeholder}}
</template>
<script lang="ts">
import Vue from "vue";

import { AxiosError, AxiosResponse } from "axios";

import CategoryBreadcrumb from "./CategoryBreadcrumb.vue";
import AssetDetail from "./AssetDetail.vue";
import FileCard from "./FileCard.vue";

import { Asset, AssetStorage, AssetFile } from "../model";
import FileUtil from "../file-util";
import CategoryUtil from "../category-util";
import * as mutations from "../mutation-types";

export default Vue.extend({
  data() {
    return {
      file: <AssetFile | null>null,
      isLoading: false,
      placeholder: ""
    };
  },
  computed: {
    id(): number {
      return Number(this.$route.params.id);
    }
  },
  methods: {
    setup() {
      if (this.file) {
        return;
      }
      let payload: mutations.PayloadAssetFileID = { id: this.id };
      this.isLoading = true;
      this.$store
        .dispatch(mutations.LOAD_ASSET_FILE, payload)
        .then(repsonse => {
          this.$store.dispatch(mutations.UPDATE_ASSET_FILES, payload);
        })
        .then(response => {
          this.$notify({
            title: "读取文件信息",
            message: "成功",
            type: "success"
          });
          let file: AssetFile | undefined = FileUtil.storage[this.id];
          if (!file) {
            this.placeholder = "无此文件";
          } else {
            this.file = file;
          }
          this.isLoading = false;
        })
        .catch((reason: AxiosError) => {
          this.$notify({
            title: "载入文件失败",
            message: `${reason.name} ${reason.message}`,
            type: "error"
          });
          this.placeholder = reason.message;
          this.isLoading = false;
        });
    }
  },
  mounted() {
    this.setup();
  },
  components: {
    AssetDetail,
    FileCard
  }
});
</script>
