<template lang="pug">
  asset-detail(v-if="asset", :asset="asset")
  div(v-else) 无此资产
</template>
<script lang="ts">
import Vue from "vue";
import CategoryBreadcrumb from "./category_breadcrumb.vue";
import AssetDetail from "./asset_detail.vue";

import { Asset } from "../model";
import CategoryUtil from "../category-util";
import AssetUtil from "../asset-util";

export default Vue.extend({
  computed: {
    asset(): Asset | undefined {
      return AssetUtil.storage[this.$route.params.id];
    }
  },
  components: {
    AssetDetail
  }
});
</script>
