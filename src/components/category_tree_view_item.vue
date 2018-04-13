<template lang="pug">
  li(v-if="category")
    router-link(:to="category.url()")
      span(:class="{current: isCurrent}") {{category.name}}
    ul
      category-tree-view-item(v-for="item in children" v-show="isOpen" :key="item.id" :category="item")
      li(v-if="isCurrent")
        button(@click='addSubCategory') 新子分类
</template>

<script lang="ts">
import Vue from "vue";
import * as _ from "lodash";
import axios from "axios";
import { Category, CategoryStorage } from "../model";
import { UPDATE_CATEGORIES } from "../mutation-types";
import { BlockStatement } from "babel-types";

export default Vue.extend({
  name: "category-tree-view-item",
  props: {
    category: { type: Category, default: null }
  },
  computed: {
    categories(): CategoryStorage {
      return this.$store.state.categories;
    },
    children(): Category[] {
      let category = this.category;
      if (category) {
        let id = category.id;
        return this.categories.filter(value => {
          return value.parent_id == id;
        });
      }
      return [];
    },
    id(): string {
      return this.$route.params.id;
    },
    isCurrent(): boolean {
      if (!this.category) {
        return false;
      }
      return this.id == this.category.id;
    },
    isOpen(): boolean {
      if (!this.category) {
        return false;
      }
      let isCurrent = (id: string): boolean => {
        if (id == this.id) {
          return true;
        }
        let children = _.filter(
          this.categories,
          value => value.parent_id == id
        );
        let current = _.find(children, value => isCurrent(value.id));
        return Boolean(current);
      };
      return isCurrent(this.category.id);
    }
  },
  methods: {
    addSubCategory() {
      if (!this.category) {
        return;
      }
      let name = prompt("名称", "未命名分类");
      let parent_id = this.category.id;
      let path = `${this.category.path}/${name}`;
      axios.post(`/api/category`, { name, parent_id, path }).then(response => {
        this.$store.commit(UPDATE_CATEGORIES);
      });
    }
  }
});
</script>

<style lang="scss" scoped>
.current {
  text-decoration: underline;
  font-weight: bold;
}
a {
  text-decoration: none;
  color: black;
}
</style>
 