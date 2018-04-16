<template lang="pug">
  el-breadcrumb(separator-class="el-icon-arrow-right" v-if="category")
    el-breadcrumb-item(v-for="category in relatedCategories" :key="category.id") 
      router-link(:to="category.url()")
        span {{category.name}}
</template>

<script lang="ts">
import Vue from "vue";
import * as _ from "lodash";
import { CategoryStorage, Category } from "../model";

export default Vue.extend({
  computed: {
    categories(): CategoryStorage {
      return this.$store.state.categories;
    },
    category(): Category | undefined {
      let id = this.$route.params.id;
      return _.find(this.categories, value => value.id == id);
    },
    relatedCategories(): Category[] {
      let category = this.category;
      let ret: Category[] = [];
      if (!category) {
        return ret;
      }
      let parent_id: string;
      let parent: Category | undefined;
      while (category) {
        ret.push(category);
        parent_id = category.parent_id;
        parent = _.find(this.categories, value => value.id == parent_id);
        category = parent;
      }
      ret.reverse();
      return ret;
    }
  }
});
</script>
