<template lang="pug">
span
  label 分类
  select(@change="route" v-model="selected")
    category-option(v-for="category in categories" :key="category.id" :category="category")
</template>

<script lang="ts">
import Vue from "vue";
import CategoryOption from "./category_option.vue";
import { Category } from "../model";

export default Vue.component("category-select", {
  data() {
    return {
      selected: null,
      categories: new Array<Category>()
    };
  },
  mounted: function() {
    this.update_categories();
  },
  methods: {
    route() {
      this.$router.push(`/category/${this.selected}`);
    },
    update_categories() {
      this.$http.get("/api/category").then(response => {
        let categories: Category[] = [];
        response.data.forEach((data: string[]) => {
          categories.push(Category.from_data(data));
        });
        console.log("cate");
        this.categories = categories;
      });
    }
  },
  components: {
    CategoryOption
  }
});
</script>

<style lang="scss" scoped>

</style>
 