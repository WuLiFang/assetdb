<template lang="pug">
div
  aside
    category-tree-view-component
  header
    nav
      router-link(to="/")
        img(class="logo")
      category-breadcrumb-component
  section
    router-view
</template>

<script lang="ts">
import Vue from "vue";
import CategorySelectComponent from "./category_select.vue";
import CategoryTreeViewComponent from "./category_tree_view.vue";
import CategoryBreadcrumbComponent from "./category_breadcrumb.vue";

export default Vue.extend({
  components: {
    CategorySelectComponent,
    CategoryTreeViewComponent,
    CategoryBreadcrumbComponent
  }
});
</script>

<style lang="scss" scoped>
$side-width: 300px;
$header-height: 40px;
nav span {
  margin: 10px;
}
header {
  z-index: 20;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: $header-height;
  background: steelblue;
}
section {
  position: relative;
  top: $header-height;
  padding-left: $side-width;
}
aside {
  position: fixed;
  left: 0;
  top: $header-height;
  bottom: 0;
  width: $side-width;
  height: 100%;
  z-index: 10;
  overflow: auto;
}
.logo {
  width: $header-height;
  height: $header-height;
  content: url("../logo.png");
}
.el-breadcrumb {
  float: right;
  margin: 12px;
}
</style>

 