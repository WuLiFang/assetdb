<template lang="pug">
div
  nav
    router-link(to="/") 资产数据库
    category-select-component
  hr
  router-view
</template>

<script lang="ts">
import Vue from "vue";
import CategorySelectComponent from "./category_select.vue";
export default Vue.extend({
  components: {
    CategorySelectComponent
  }
});
</script>

<style lang="scss" scoped>
nav span {
  margin: 10px;
}
</style>
 