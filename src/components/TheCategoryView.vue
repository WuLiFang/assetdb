<template lang="pug">
  el-container(v-if="category")
    el-aside(class="hidden-xs-only")
      CategoryTree
    el-container
      el-header(height='')
        CategoryBreadcrumb(:category="category")
        el-row
          el-col(:span="12")
            div ID: {{category.id}}
          el-col(:span="12")
            div 路径: {{category.path}}
        CategoryToolbar(:category="category" class='toolbar')
      el-main
        AssetsView(:category="category")
</template>

<script lang="ts">
import Vue from "vue";

import * as _ from "lodash";
import axios from "axios";

import AssetsView from "./AssetsView.vue";
import CategoryBreadcrumb from "./CategoryBreadcrumb.vue";
import CategoryTree from "./CategoryTree.vue";
import CategoryToolbar from "./CategoryToolbar.vue";

import { Category, CategoryStorage } from "../model";

export default Vue.extend({
  computed: {
    categories(): CategoryStorage {
      return this.$store.state.categories;
    },
    id(): string {
      return this.$route.params.id;
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
    AssetsView,
    CategoryBreadcrumb,
    CategoryTree,
    CategoryToolbar
  }
});
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  padding: 20px;
  font-size: 1em;
}
</style>
