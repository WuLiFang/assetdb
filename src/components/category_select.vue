<template lang="pug">
span
  label 分类
  select(@change="route" v-model="selected")
    category-option(v-for="category in categories" :key="category.id" :category="category")
  button(@click="update_categories") 刷新
</template>

<script lang="ts">
import Vue from "vue";
import CategoryOption from "./category_option.vue";
import { Category } from "../model";

export default Vue.extend({
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
      let category = this.categories.filter(value => {
        return value.id == this.selected;
      })[0];
      this.$router.push(`/category/${category.id}/${category.name}`);
    },
    update_categories() {
      this.$http.get("/api/category").then(response => {
        let categories: Category[] = [];
        response.data.forEach((data: string[]) => {
          categories.push(Category.from_data(data));
        });
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
 