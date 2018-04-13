<template lang="pug">
  div(v-if="category")
    h1 
      input(v-model='category.name')
    div ID: {{category.id}}
    div 路径: {{category.path}}
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
    category(): Category | undefined {
      return _.find(this.categories, value => value.id == this.id);
    }
  },
  watch: {
    category: {
      handler(newValue, oldValue) {
        if (!newValue || (newValue && oldValue && newValue.id == oldValue.id)) {
          return;
        }
        updateCategory(newValue);
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

