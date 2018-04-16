<template lang="pug">
div
  aside
    category-tree-view-component
  header
    nav
      router-link(to="/") 资产数据库
      category-select-component
  section
    router-view
</template>

<script lang="ts">
import Vue from "vue";
import CategorySelectComponent from "./category_select.vue";
import CategoryTreeViewComponent from "./category_tree_view.vue";
export default Vue.extend({
  components: {
    CategorySelectComponent,
    CategoryTreeViewComponent
  }
});
</script>

<style lang="scss" scoped>
$side-width: 300px;
$header-height: 35px;
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
  background: lightblue;
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
</style>
 