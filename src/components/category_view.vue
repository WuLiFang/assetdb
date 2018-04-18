<template lang="pug">
  el-container(v-if="category")
    el-aside(class="hidden-xs-only")
      category-tree
    el-container
      el-header(height='')
        category-breadcrumb(class='breadcrumb' :category="category")
        el-row
          el-col(:span="12")
            div ID: {{category.id}}
          el-col(:span="12")
            div 路径: {{category.path}}
        category-toolbar(:category="category" class='toolbar')
      el-main
        assets-view(:category="category")
</template>

<script lang="ts">
import Vue from "vue";
import * as _ from "lodash";
import axios from "axios";
import { Category, CategoryStorage } from "../model";
import AssetsView from "./assets_view.vue";
import CategoryBreadcrumb from "./category_breadcrumb.vue";
import CategoryTree from "./category_tree.vue";
import CategoryToolbar from "./category_toolbar.vue";

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
.breadcrumb {
  padding: 20px;
  font-size: 1em;
}
</style>
