<template lang="pug">
  el-select
    el-option(v-for="category in categories" :key="category.id" :label="category.name" :value="category.id") 
</template>

<script lang="ts">
import Vue from "vue";
import { Category, CategoryStorage } from "../model";
import { UPDATE_CATEGORIES } from "../mutation-types";

export default Vue.extend({
  props: ["v-model"],
  computed: {
    categories(): CategoryStorage {
      return this.$store.state.categories;
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
 