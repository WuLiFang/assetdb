<template lang="pug">
  .root(v-if="category")
    CategoryTree.left(:category='category')
    .right
        CategoryBreadcrumb(:category="category")
        CategoryToolbar(:category="category" class='toolbar')
        CategoryAssetsView(:category="category")
</template>

<script lang="ts">
import Vue from "vue";

import * as _ from "lodash";
import axios from "axios";

import CategoryAssetsView from "./CategoryAssetsView.vue";
import CategoryBreadcrumb from "./CategoryBreadcrumb.vue";
import CategoryTree from "./CategoryTree.vue";
import CategoryToolbar from "./CategoryToolbar.vue";

import { Category, CategoryStorage } from "../model";
import { categoryComputedMinxin } from "../store/category";

export default Vue.extend({
  computed: {
    ...categoryComputedMinxin,
    id(): number {
      return Number(this.$route.params.id);
    },
    category(): Category | undefined {
      return this.categoryStore.storage[this.id];
    }
  },
  components: {
    CategoryAssetsView,
    CategoryBreadcrumb,
    CategoryTree,
    CategoryToolbar
  }
});
</script>
<style lang="scss" scoped>
@import "./variables.scss";

.root {
  display: flex;
  overflow: auto;
  flex-flow: column;
  @media (min-width: $fullscreen-layout-min-width) {
    flex-flow: row;
  }
  .left {
    flex: 0 0 30em;
    @media (min-width: $fullscreen-layout-min-width) {
      flex: 1 0 auto;
    }
  }
  .right {
    display: flex;
    flex: 1 1 auto;
    flex-flow: column;
    .category-assets-view {
      @media (min-width: $fullscreen-layout-min-width) {
        flex: 0 1 auto;
        overflow: auto;
      }
    }
  }
}
</style>
