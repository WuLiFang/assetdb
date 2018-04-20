<template lang="pug">
  el-container
    el-header
      category-breadcrumb(:category="parentCategory") 
        el-breadcrumb-item 
          span {{asset.name}}
    div WIP
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

<style lang="scss" scoped>
.el-breadcrumb {
  padding: 20px;
  font-size: 1em;
}
</style>
