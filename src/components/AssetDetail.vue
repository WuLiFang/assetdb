<template lang="pug">
  .asset-detail
    CategoryBreadcrumb(:category="parentCategory") 
      el-breadcrumb-item 
        span {{asset.name}}
    .description {{asset.description}}
</template>

<script lang="ts">
import Vue from "vue";

import CategoryBreadcrumb from "./CategoryBreadcrumb.vue";

import { Asset, Category } from "../model";
import { categoryComputedMinxin } from "../store/category";

export default Vue.extend({
  props: {
    asset: {
      type: Asset
    }
  },
  computed: {
    ...categoryComputedMinxin,
    parentCategory(): Category | undefined {
      return this.categoryStore.storage[this.asset.category_id];
    }
  },
  components: {
    CategoryBreadcrumb
  }
});
</script>

<style lang="scss" scoped>
.asset-detail {
  display: flex;
  flex-flow: column;
  .el-breadcrumb {
    padding: 20px;
    font-size: 1em;
  }
}
</style>
