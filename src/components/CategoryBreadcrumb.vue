<template lang="pug">
  el-breadcrumb(separator-class="el-icon-arrow-right")
    el-breadcrumb-item(v-for="i in relatedCategories" :key="i.id") 
      router-link(:to="categoryMetaData.routeURLMap[i.id]")
        span {{i.name}}
    slot
</template>

<script lang="ts">
import Vue from "vue";
import * as _ from "lodash";

import { CategoryStorage, Category } from "../model";
import { categoryComputedMinxin } from "../store/category";

export default Vue.extend({
  props: {
    category: { type: Category }
  },
  data() {
    return {};
  },
  computed: {
    ...categoryComputedMinxin,
    relatedCategories(): Category[] {
      return this.getLogicalCategoryPath(this.category);
    }
  }
});
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  padding: 20px;
  font-size: 1em;
}
</style>
