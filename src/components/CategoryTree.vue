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
      @current-change="onCurrentChange"
      highlight-current
    )
      span.custom-tree-node(slot-scope="{node, data}" @load="onNodeLoad(data)")
        span {{data.category.name}}
        el-badge(:value="data.category.count")
</template>

<script lang="ts">
import Vue from "vue";
import { TreeNode, ElTree } from "element-ui/types/tree";
import { Tree } from "element-ui";

import { CategoryStorage, Category } from "../model";
import * as mutations from "../mutation-types";
import {
  CategoryChildrenMap,
  CategoryRouteURLMap,
  CategoryRecurseCountMap
} from "../store/types";
import { categoryGetterMinxin } from "../store/category";

interface TreeModel {
  id: string;
  label: string;
  category: Category;
  children?: TreeModel[];
  disabled?: boolean;
  isLeaf?: boolean;
}

export default Vue.extend({
  data() {
    return {
      filterText: "",
      defaultProps: {
        label: "label",
        children: "children"
      },
      currentCategory: <Category | null>null
    };
  },
  computed: {
    model(): TreeModel[] | null {
      if (!this.rootCategory) {
        return null;
      }
      let getModel = (category: Category): TreeModel => {
        let children = this.childrenMap[category.id];
        return {
          id: String(category.id),
          label: category.name,
          category: category,
          children: children.map(value => getModel(value))
        };
      };
      return [getModel(this.rootCategory)];
    },
    ...categoryGetterMinxin
  },
  methods: {
    onCurrentChange(data: TreeModel, node: any) {
      this.currentCategory = data.category;
      this.$router.push(this.routeURLMap[data.category.id]);
    },
    matchCurrent() {
      let id = this.$route.params.id;
      let category = this.storage[Number(id)];
      if (!category) {
        return;
      }

      this.childrenMap[category.id].forEach(value => {
        let payload: mutations.PayloadCategoryID = { id: value.id };
        this.$store.dispatch(mutations.COUNT_CATEGORY, payload);
      });
      let logicalPath: Array<
        Category
      > = this.$store.getters.getLogicalCategoryPath(category);
      logicalPath.forEach(value => this.expand(value.id));
    },
    expand(id: number) {
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
    },
    $route() {
      this.matchCurrent();
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
