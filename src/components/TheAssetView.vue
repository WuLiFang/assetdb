<template lang="pug">
  AssetDetail(v-if="asset", :asset="asset")
  div(v-else v-loading="isLoading") {{placeholder}}
</template>
<script lang="ts">
import Vue from "vue";

import { AxiosError, AxiosResponse } from "axios";

import CategoryBreadcrumb from "./CategoryBreadcrumb.vue";
import AssetDetail from "./AssetDetail.vue";

import { Asset, AssetStorage } from "../model";
import AssetUtil from "../asset-util";
import CategoryUtil from "../category-util";
import * as mutations from "../mutation-types";

export default Vue.extend({
  data() {
    return {
      asset: <Asset | null>null,
      isLoading: false,
      placeholder: ""
    };
  },
  computed: {
    id(): string {
      return this.$route.params.id;
    }
  },
  methods: {
    setup() {
      if (this.asset) {
        return;
      }
      let payload: mutations.PayloadAssetId = { id: this.id };
      this.isLoading = true;
      this.$store
        .dispatch(mutations.LOAD_ASSET, payload)
        .then(response => {
          this.$notify({ title: "读取资产", message: "成功", type: "success" });
          let asset: Asset | undefined = AssetUtil.storage[this.id];
          if (!asset) {
            this.placeholder = "无此资产";
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
          this.placeholder = reason.message;
          this.isLoading = false;
        });
    }
  },
  mounted() {
    this.setup();
  },
  components: {
    AssetDetail
  }
});
</script>
