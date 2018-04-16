<template lang="pug">
  div
    el-button(@click="update" icon="el-icon-refresh" size="mini") 刷新
    ul
      category-tree-view-item-component(:category="topCategory")
</template>

<script lang="ts">
import Vue from "vue";
import * as _ from "lodash";
import { Category, CategoryStorage } from "../model";
import CategoryTreeViewItemComponent from "./category_tree_view_item.vue";
import { UPDATE_CATEGORIES } from "../mutation-types";

export default Vue.extend({
  data() {
    return {
      open: false
    };
  },
  computed: {
    categories(): CategoryStorage {
      return this.$store.state.categories;
    },
    topCategory(): Category | undefined {
      return _.find(this.categories, value => {
        return !value.parent_id;
      });
    }
  },
  methods: {
    update() {
      this.$store.commit(UPDATE_CATEGORIES);
    }
  },
  components: {
    CategoryTreeViewItemComponent
  }
});
</script>

<style lang="scss" scoped>

</style>
 