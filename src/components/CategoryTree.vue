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
import { mapActions } from "vuex";

import * as _ from "lodash";
import { TreeNode, ElTree } from "element-ui/types/tree";
import { Tree } from "element-ui";

import { CategoryStorage, Category } from "../model";
import CategoryUtil from "../category-util";
import * as mutations from "../mutation-types";

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
      currentCategory: <Category | null>null,
      isShowDialog: false,
      CategoryUtil
    };
  },
  computed: {
    model(): TreeModel[] | null {
      let top = _.find(this.categories, value => !value.parent_id);
      if (!top) {
        return null;
      }
      let getModel = (category: Category): TreeModel => {
        let children = _.filter(
          this.categories,
          value => value.parent_id == category.id
        );
        return {
          id: String(category.id),
          label: category.name,
          category: category,
          children: _.map(children, value => getModel(value))
        };
      };
      return [getModel(top)];
    },
    categories(): CategoryStorage {
      return this.$store.state.categories;
    },
    allowDelete(): boolean {
      let category = this.currentCategory;
      if (!category) {
        return false;
      }
      return (
        CategoryUtil.getChildren(category).length === 0 &&
        CategoryUtil.getRecurseCount(category) === 0
      );
    }
  },
  methods: {
    onCurrentChange(data: TreeModel, node: any) {
      this.currentCategory = data.category;
      this.$router.push(CategoryUtil.url(data.category));
    },
    matchCurrent() {
      let id = this.$route.params.id;
      let category = CategoryUtil.getCategory(Number(id));
      if (!category) {
        return;
      }
      CategoryUtil.getChildren(category).forEach(value => {
        let payload: mutations.PayloadCategoryID = { id: value.id };
        this.$store.dispatch(mutations.COUNT_CATEGORY, payload);
      });
      CategoryUtil.getRelated(category).forEach(value => this.expand(value.id));
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
  },
  mounted() {
    this.matchCurrent();
  },
  updated() {
    this.matchCurrent();
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
