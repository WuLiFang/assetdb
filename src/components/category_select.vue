<template lang="pug">
span
  label 分类
  select(@change="route" v-model="selected")
    category-option(v-for="category in categories" :key="category.id" :category="category")
  el-button(@click="update" icon="el-icon-refresh" size="mini") 刷新
</template>

<script lang="ts">
import Vue from "vue";
import CategoryOption from "./category_option.vue";
import { Category, CategoryStorage } from "../model";
import { UPDATE_CATEGORIES } from "../mutation-types";

export default Vue.extend({
  data() {
    return {
      selected: this.$route.params.id
    };
  },
  methods: {
    route() {
      let category = this.categories.filter(value => {
        return value.id == this.selected;
      })[0];
      this.$router.push(category.url());
    },
    update() {
      this.$store.commit(UPDATE_CATEGORIES);
    },
    matchCurrent() {
      this.selected = this.$route.params.id;
    }
  },
  computed: {
    categories(): CategoryStorage {
      return this.$store.state.categories;
    }
  },
  watch: {
    $route() {
      this.matchCurrent();
    }
  },
  components: {
    CategoryOption
  }
});
</script>

<style lang="scss" scoped>

</style>
 