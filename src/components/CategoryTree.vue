<template lang="pug">
  .category-tree
    el-input(
      v-model="filterText"
      size="mini"
      placeholder="正则过滤"
      prefix-icon="el-icon-search"
    )
    el-tree(
      ref="tree"
      node-key="id"
      :data="model"
      :props="defaultProps"
      :filter-node-method="filterNode"
      @node-click="onNodeClick"
      highlight-current
    )
      span.custom-tree-node(slot-scope="{node, data}")
        span {{data.category.name}}
        el-badge(:value="getCount(data.category)")
</template>

<script lang="ts">
import Vue from "vue";
import { TreeNode, ElTree } from "element-ui/types/tree";
import { Tree } from "element-ui";

import { CategoryStorage, Category } from "../model";
import * as mutations from "../mutation-types";
import { categoryComputedMinxin } from "../store/category";

interface TreeModel {
  id: string;
  label: string;
  category: Category;
  children?: TreeModel[];
  disabled?: boolean;
  isLeaf?: boolean;
}

export default Vue.extend({
  props: {
    category: { type: Category }
  },
  data() {
    return {
      filterText: "",
      defaultProps: {
        label: "label",
        children: "children"
      }
    };
  },
  computed: {
    ...categoryComputedMinxin,
    root(): Category | undefined {
      return this.categoryMetaData.root;
    },
    model(): TreeModel[] | null {
      this.$nextTick(() => {
        this.matchCurrent();
      });
      return this.root ? [this.getModel(this.root)] : null;
    }
  },
  methods: {
    getModel(category: Category): TreeModel {
      let children = this.categoryMetaData.childrenMap[category.id];
      return {
        id: category.id,
        label: category.name,
        category: category,
        children: children.map(value => this.getModel(value))
      };
    },
    getCount(category: Category): number | null {
      return this.categoryStore.countMap[category.id];
    },
    onNodeClick(data: TreeModel) {
      this.categoryMetaData.childrenMap[data.category.id].forEach(value => {
        let payload: mutations.PayloadCategoryID = { id: value.id };
        this.$store.dispatch(mutations.COUNT_CATEGORY, payload);
      });
      this.$router.push(this.categoryMetaData.routeURLMap[data.category.id]);
    },
    matchCurrent() {
      this.getLogicalCategoryPath(this.category).forEach(value => {
        this.expand(value.id);
      });
    },
    expand(id: string) {
      let tree = <ElTree>this.$refs.tree;
      interface _TreeNode extends TreeNode {
        expanded: boolean;
      }
      let node = <_TreeNode | null>tree.getNode(id);
      if (node) {
        node.expanded = true;
      }
    },
    filterNode(value: string, data: TreeModel) {
      if (!value) return true;
      return new RegExp(value, "i").test(data.category.name);
    }
  },
  watch: {
    filterText(value) {
      let tree = <ElTree>this.$refs.tree;
      tree.filter(value);
    }
  }
});
</script>

<style lang="scss" scoped>
.category-tree {
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}
</style>
