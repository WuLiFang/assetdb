<template lang="pug">
  el-container
    el-header
      category-breadcrumb(:category="parentCategory")
    div {{asset.name}} WIP
</template>

<script lang="ts">
import Vue from "vue";
import CategoryBreadcrumb from "./category_breadcrumb.vue";
import { Asset, Category } from "../model";
import CategoryUtil from "../category-util";
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
