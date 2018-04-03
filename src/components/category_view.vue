<template lang="pug">
  div
    h1 {{category.name}}
    div ID: {{category.id}}
    div 路径: {{category.path}}
    ul(v-for='childCategory in childCategories',:key='category.id')
      router-link(:to="`/category/${childCategory.id}/${childCategory.name}`")
        li {{childCategory.name}}
</template>

<script lang="ts">
import Vue from "vue";
import { Category, categoryStorage } from "../model";
export default Vue.extend({
  computed: {
    id: function(): string {
      return this.$route.params.id;
    },
    category: function(): Category {
      return Category.from_id(this.id);
    },
    childCategories: function(): Category[] {
      return categoryStorage.filter(value => {
        return value.parent_id == this.id;
      });
    }
  }
});
</script>

