<template lang="pug">
  li(v-if="category")
    router-link(:to="category.url()")
      span(:class="{current: isCurrent}") {{category.name}}
    ul
      category-tree-view-item(v-for="item in children" v-show="isOpen" :category="item" v-on:open="open")
      li(v-if="isCurrent")
        button(@click='addSubCategory') 新子分类
</template>

<script lang="ts">
import Vue from "vue";
import * as _ from "lodash";
import axios from "axios";
import { Category, CategoryStorage } from "../model";
import { UPDATE_CATEGORIES } from "../mutation-types";

export default Vue.extend({
  name: "category-tree-view-item",
  props: {
    category: { type: Category, default: null }
  },
  data() {
    return {
      isOpen: false
    };
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
    }
  },
  methods: {
    open() {
      if (!this.isOpen) {
        this.isOpen = true;
        this.$emit("open");
      }
    },
    close() {
      if (this.isOpen) {
        this.isOpen = false;
        this.$emit("close");
      }
    },
    update() {
      if (this.isCurrent) {
        this.open();
      } else {
        this.close();
      }
    },
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
      console.log(name);
    }
  },
  watch: {
    id() {
      this.update();
    },
    isCurrent(newValue) {
      this.update();
    }
  },
  created() {
    if (this.isCurrent) {
      this.open();
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
 