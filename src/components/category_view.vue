<template lang="pug">
  div(v-if="category")
    router-link(:to="parentCategory.url()" v-if="!parentCategory.isTopLevel()")
      span {{ parentCategory.name }}
    h1 {{category.name}}
    div ID: {{category.id}}
    div 路径: {{category.path}}
    ul(v-for='childCategory in childCategories', :key='childCategory.id')
      router-link(:to="childCategory.url()")
        li {{childCategory.name}}
    asset-view(:category="category")
</template>

<script lang="ts">
import Vue from "vue";
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
  components: {
    AssetView
  }
});
</script>

