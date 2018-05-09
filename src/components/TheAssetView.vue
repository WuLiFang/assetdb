<template lang="pug">
  div(v-loading="isLoading")
    div(v-if="asset")
      AssetDetail(:asset="asset")
      div.cards
        FileCard(v-for="file in asset.files" :file="file" :key='file.id')
    div(v-else) {{placeholderText}}
</template>
<script lang="ts">
import Vue from "vue";

import { AxiosError, AxiosResponse } from "axios";

import CategoryBreadcrumb from "./CategoryBreadcrumb.vue";
import AssetDetail from "./AssetDetail.vue";
import FileCard from "./FileCard.vue";

import { Asset, AssetStorage } from "../model";
import AssetUtil from "../asset-util";
import CategoryUtil from "../category-util";
import * as mutations from "../mutation-types";

export default Vue.extend({
  data() {
    return {
      asset: <Asset | null>null,
      isLoading: false,
      placeholderText: ""
    };
  },
  computed: {
    id(): number {
      return Number(this.$route.params.id);
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
        .dispatch(mutations.LOAD_ASSET, payload)
        .then(repsonse => {
          this.$store.dispatch(mutations.UPDATE_ASSET_FILES, payload);
        })
        .then(response => {
          this.$notify({
            title: "读取资产信息",
            message: "成功",
            type: "success"
          });
          let asset: Asset | undefined = AssetUtil.storage[this.id];
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
    FileCard
  }
});
</script>
