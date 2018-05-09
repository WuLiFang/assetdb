<template lang="pug">
  .root(v-if="category")
    CategoryTree.left.hidden-xs-only2
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

export default Vue.extend({
  computed: {
    categories(): CategoryStorage {
      return this.$store.state.categories;
    },
    id(): number {
      return Number(this.$route.params.id);
    },
    category(): Category | undefined {
      return _.find(this.categories, value => value.id == this.id);
    }
  },
  methods: {
    updateCategory: _.debounce(function(this: Vue, category: Category) {
      axios
        .put(`/api/category/${category.id}`, category)
        .then(() => {
          this.$message({ message: "更新分类信息成功", type: "success" });
        })
        .catch(() => {
          this.$message({ message: "更新分类信息失败", type: "error" });
        });
    }, 2000)
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
