<template lang="pug">
  el-breadcrumb(separator-class="el-icon-arrow-right")
    el-breadcrumb-item(v-for="i in relatedCategories" :key="i.id") 
      router-link(:to="CategoryUtil.url(i)")
        span {{i.name}}
</template>

<script lang="ts">
import Vue from "vue";
import * as _ from "lodash";
import { CategoryStorage, Category } from "../model";
import CategoryUtil from "../category-util";

export default Vue.extend({
  props: {
    category: { type: Category }
  },
  data() {
    return {
      CategoryUtil
    };
  },
  computed: {
    categories(): CategoryStorage {
      return this.$store.state.categories;
    },
    relatedCategories(): Category[] {
      return CategoryUtil.getRelated(this.category);
    }
  }
});
</script>

