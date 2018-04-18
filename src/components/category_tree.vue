<template lang="pug">
  div
    el-button-group(class="toolbar")
      el-button(icon="el-icon-refresh" @click='update' size='mini') 刷新
      el-button(icon="el-icon-plus" @click='addSubCategory(currentCategory)' size='mini' :disabled="!currentCategory" type="primary") 新子分类
      el-button(icon="el-icon-edit" @click='isShowDialog = true' size='mini' :disabled="!currentCategory" type="primary") 编辑
      el-button(icon="el-icon-delete" @click='deleteCategory(currentCategory)' size='mini' :disabled="true" type="danger") 删除
    el-input(placeholder="正则过滤" v-model="filterText" size="mini")
    el-tree(:data="model" :props="defaultProps"  @current-change="onCurrentChange" node-key="id" ref="tree" :filter-node-method="filterNode" highlight-current=true)
      span(slot-scope="{node, data}" class="custom-tree-node" @load="onNodeLoad(data)")
        span {{data.category.name}}

    el-dialog(v-if="currentCategory" :visible.sync="isShowDialog" :title='currentCategory ? `编辑: ${currentCategory.name}` : ""')
      div 父分类
        el-select(v-model='currentCategory.parent_id' filterable)
          el-option(v-for="category in categories" :key="category.id" :label="category.name" :value="category.id" :disabled='!CategoryUtil.isLegalParent(currentCategory, category)')
      div 名称
        el-input(v-model='currentCategory.name')
      span(slot='footer')
        el-button 取消
        el-button(type='primary') 确定
</template>

<script lang="ts">
import Vue from "vue";
import * as _ from "lodash";
import { CategoryStorage, Category } from "../model";
import { ADD_CATEGORY, UPDATE_CATEGORIES } from "../mutation-types";
import * as mutations from "../mutation-types";
import {
  TreeNode,
  ElTree
} from "../../node_modules/_element-ui@2.3.4@element-ui/types/tree";
import { Tree } from "../../node_modules/_element-ui@2.3.4@element-ui";
import { MessageBoxInputData } from "../../node_modules/_element-ui@2.3.4@element-ui/types/message-box";
import { mapActions } from "../../node_modules/_vuex@3.0.1@vuex";
import CategorySelect from "./category_select.vue";
import CategoryUtil from "../category-util";

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
          id: category.id,
          label: category.name,
          category: category,
          children: _.map(children, value => getModel(value))
        };
      };
      return [getModel(top)];
    },
    categories(): CategoryStorage {
      return this.$store.state.categories;
    }
  },
  methods: {
    onCurrentChange(data: TreeModel, node: any) {
      this.currentCategory = data.category;
      this.$router.push(CategoryUtil.url(data.category));
    },
    addSubCategory(parent: Category) {
      console.log(parent);
      this.$store.dispatch(ADD_CATEGORY, { parent });
    },
    editCategory(category: Category) {
      this.$prompt("名称", `${category.name}: 编辑分类`).then(value => {
        let data = <MessageBoxInputData>value;
        data.value;
      });
    },
    matchCurrent() {
      let id = this.$route.params.id;
      let match = (id: string) => {
        let category = _.find(this.categories, value => value.id == id);
        if (category) {
          this.expand(category.id);
          match(category.parent_id);
        }
      };
      match(id);
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
    },
    ...mapActions({ update: UPDATE_CATEGORIES })
  },
  watch: {
    filterText(value) {
      let tree = <ElTree>this.$refs.tree;
      tree.filter(value);
    }
  },
  updated() {
    this.matchCurrent();
  },
  components: {
    CategorySelect
  }
});
</script>
<style lang="scss" scoped>
.toolbar {
  display: flex;
  justify-content: flex-end;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
