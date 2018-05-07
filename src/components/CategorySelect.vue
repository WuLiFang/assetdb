<template lang="pug">
  el-select
    el-option(v-for="category in categories" :key="category.id" :label="category.name" :value="category.id") 
</template>

<script lang="ts">
import Vue from "vue";

import { CategoryStorage } from "../model";

export default Vue.extend({
  computed: {
    categories(): CategoryStorage {
      return this.$store.state.categories;
    }
  }
});
</script>

<style lang="scss" scoped>

</style>
 