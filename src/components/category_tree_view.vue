<template lang="pug">
  div
    category-tree-view-item-component(:category="topCategory")
</template>

<script lang="ts">
import Vue from "vue";
import * as _ from "lodash";
import { Category, CategoryStorage } from "../model";
import CategoryTreeViewItemComponent from "./category_tree_view_item.vue";

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
  components: {
    CategoryTreeViewItemComponent
  }
});
</script>

<style lang="scss" scoped>

</style>
 