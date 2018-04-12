<template lang="pug">
  li(v-if="category")
    router-link(:to="category.url()")
      span(:class="{current: isCurrent}") {{category.name}}
    ul(v-for="item in children" v-show="isOpen")
      category-tree-view-item(:category="item" v-on:open="open")
</template>

<script lang="ts">
import Vue from "vue";
import * as _ from "lodash";
import { Category, CategoryStorage } from "../model";

export default Vue.extend({
  name: "category-tree-view-item",
  props: {
    category: Category
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
    update() {
      this.isOpen = false;
      if (this.isCurrent) {
        this.open();
      }
    }
  },
  watch: {
    id() {
      this.update();
    }
  },
  created() {
    this.update();
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
 