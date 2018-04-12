<template lang="pug">
  div(v-if="category")
    router-link(:to="parentCategory.url()" v-if="!parentCategory.isTopLevel()")
      span {{ parentCategory.name }}
    h1 
      input(v-model='category.name')
    div ID: {{category.id}}
    div 路径: {{category.path}}
    ul(v-for='childCategory in childCategories', :key='childCategory.id')
      router-link(:to="childCategory.url()")
        li {{childCategory.name}}
    asset-view(:category="category")
</template>

<script lang="ts">
import Vue from "vue";
import * as _ from "lodash";
import axios from "axios";
import { Category, CategoryStorage } from "../model";
import AssetView from "./asset_view.vue";

export default Vue.extend({
  computed: {
    categories(): CategoryStorage {
      return this.$store.state.categories;
    },
    id(): string {
      return this.$route.params.id;
    },
    category(): Category {
      return this.categories.select(this.id);
    },
    childCategories(): Category[] {
      return this.categories.filter(value => {
        return value.parent_id == this.id;
      });
    },
    parentCategory(): Category {
      return this.categories.select(this.category.parent_id);
    }
  },
  watch: {
    category: {
      handler(newValue, oldValue) {
        if (newValue.id != oldValue.id) {
          return;
        }
        updateCategory(this.category);
      },
      deep: true
    }
  },
  components: {
    AssetView
  }
});

function _updateCategory(category: Category) {
  axios.put(`/api/category/${category.id}`, category);
}
let updateCategory = _.debounce(_updateCategory, 2000);
</script>

