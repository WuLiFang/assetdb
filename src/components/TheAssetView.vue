<template lang="pug">
  .the-asset-view(v-loading="isLoading" v-if="asset")
      AssetDetail(:asset="asset")
      el-tabs(tabPosition='right')
        el-tab-pane(label='查看')
          div.cards
            FileCard(v-for="file in files" :file="file" :key='file.id')
        el-tab-pane(label='管理')
          AssetManagePane(:asset='asset')
  div(v-else) {{placeholderText}}
</template>
<script lang="ts">
import Vue from "vue";

import { AxiosError, AxiosResponse } from "axios";

import CategoryBreadcrumb from "./CategoryBreadcrumb.vue";
import AssetDetail from "./AssetDetail.vue";
import AssetManagePane from "./AssetManagePane.vue";
import FileCard from "./FileCard.vue";

import { Asset, AssetStorage, AssetFile } from "../model";
import * as mutations from "../mutation-types";
import { assetComputedMinxin } from "../store/asset";

export default Vue.extend({
  data() {
    return {
      asset: <Asset | null>null,
      isLoading: false,
      placeholderText: ""
    };
  },
  computed: {
    ...assetComputedMinxin,
    id(): string {
      return this.$route.params.id;
    },
    files(): AssetFile[] {
      return this.assetStore.fileMap[this.id];
    }
  },
  methods: {
    setup() {
      if (this.asset) {
        return;
      }
      let payload: mutations.PayloadAssetID = { id: this.id };
      this.isLoading = true;
      this.$store
        .dispatch(mutations.UPDATE_ASSET, payload)
        .then(repsonse => {
          this.$store.dispatch(mutations.UPDATE_ASSET_RELATED_FILES, payload);
        })
        .then(response => {
          let asset: Asset | undefined = this.assetStore.storage[this.id];
          if (!asset) {
            this.placeholderText = "无此资产";
          } else {
            this.asset = asset;
          }
          this.isLoading = false;
        })
        .catch((reason: AxiosError) => {
          this.$notify({
            title: "载入资产失败",
            message: `${reason.name} ${reason.message}`,
            type: "error"
          });
          this.placeholderText = reason.message;
          this.isLoading = false;
        });
    }
  },
  mounted() {
    this.setup();
  },
  components: {
    AssetDetail,
    AssetManagePane,
    FileCard
  }
});
</script>
<style lang="scss" scoped>
@import "./variables.scss";

.the-asset-view {
  display: flex;
  flex-flow: column;
  .cards {
    display: flex;
  }
}
</style>
