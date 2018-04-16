<template lang="pug">
  div(v-if="category")
    h1 
      input(v-model='category.name')
    div ID: {{category.id}}
    div 路径: {{category.path}}
    assets-view(:category="category")
</template>

<script lang="ts">
import Vue from "vue";
import * as _ from "lodash";
import axios from "axios";
import { Category, CategoryStorage } from "../model";
import AssetsView from "./assets_view.vue";

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
      handler(newValue: Category | undefined, oldValue: Category | undefined) {
        if (
          !newValue ||
          !oldValue ||
          (newValue && oldValue && newValue.id != oldValue.id)
        ) {
          return;
        }
        if (!newValue.name) {
          return;
        }
        this.updateCategory(newValue);
      },
      deep: true
    }
  },
  methods: {
    updateCategory: _.debounce(function(this: Vue, category: Category) {
      axios
        .put(`/api/category/${category.id}`, category)
        .then(() => {
          this.$message({ message: "更新分类信息成功", type: "success" });
        })
        .catch(() => {
          this.$message({ message: "更新分类信息失败", type: "error" });
        });
    }, 2000)
  },
  components: {
    AssetsView
  }
});
</script>

