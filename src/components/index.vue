<template lang="pug">
div
  aside
    category-tree-component
  header
    router-link(to="/")
      img(class="logo")
  section(class='main')
    router-view
</template>

<script lang="ts">
import Vue from "vue";
import CategorySelectComponent from "./category_select.vue";
import CategoryTreeComponent from "./category_tree.vue";

export default Vue.extend({
  components: {
    CategorySelectComponent,
    CategoryTreeComponent
  }
});
</script>

<style lang="scss" scoped>
$side-width: 315px;
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
.main {
  position: absolute;
  left: $side-width;
  top: $header-height;
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

 