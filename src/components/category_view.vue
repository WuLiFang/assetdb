<template lang="pug">
  div(v-if="category")
    router-link(:to="parentCategory.url()" v-if="!parentCategory.isTopLevel()")
      span {{ parentCategory.name }}
    h1 {{category.name}}
    div ID: {{category.id}}
    div 路径: {{category.path}}
    ul(v-for='childCategory in childCategories',:key='category.id')
      router-link(:to="childCategory.url()")
        li {{childCategory.name}}
    asset-view(:category="category")
</template>

<script lang="ts">
import Vue from "vue";
import { Category, CategoryStorage } from "../model";
import AssetView from "./asset_view.vue";

export default Vue.extend({
  data() {
    return {
      categories: <CategoryStorage>this.$root.$data["categories"]
    };
  },
  computed: {
    id(): string {
      return this.$route.params.id;
    },
    category(): Category {
      console.log(this.id);
      return this.categories.filter(value => {
        console.log(value);
        return value.id == this.id;
      })[0];
    },
    childCategories(): Category[] {
      return this.categories.filter(value => {
        return value.parent_id == this.id;
      });
    },
    parentCategory(): Category {
      return this.categories.filter(value => {
        return value.id == this.category.parent_id;
      })[0];
    }
  },
  components: {
    AssetView
  }
});
</script>

