<template lang="pug">
  el-container
    el-header
      CategoryBreadcrumb(:category="parentCategory") 
        el-breadcrumb-item 
          span {{asset.name}}
    div {{asset.description}}
</template>

<script lang="ts">
import Vue from "vue";

import CategoryBreadcrumb from "./CategoryBreadcrumb.vue";

import CategoryUtil from "../category-util";
import { Asset, Category } from "../model";

export default Vue.extend({
  props: {
    asset: {
      type: Asset
    }
  },
  computed: {
    parentCategory(): Category | undefined {
      return CategoryUtil.getCategory(this.asset.category_id);
    }
  },
  components: {
    CategoryBreadcrumb
  }
});
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  padding: 20px;
  font-size: 1em;
}
</style>
