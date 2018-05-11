<template lang="pug">
  .category-toolbar
    el-button-group
      el-button(icon="el-icon-refresh" @click='updateAssets') 刷新
      el-button(icon="el-icon-edit" @click='isShowCategoryEditDialog = true' type="primary") 编辑
      el-button(icon="el-icon-plus" @click='isShowCategoryCreationDialog = true' type="primary") 新子分类
      el-button(icon="el-icon-plus" @click='isShowAssetCreationDialog = true' type="primary") 新资产
      el-button(icon="el-icon-delete" @click='deleteCategory' :disabled="!allowDelete" type="danger") 删除

    CategoryEditDialog(:category='category' :visible.sync='isShowCategoryEditDialog')
    CategoryCreationDialog(:category='category' :visible.sync='isShowCategoryCreationDialog')
    AssetCreationDialog(:category='category' :visible.sync='isShowAssetCreationDialog')

</template>
<script lang="ts">
import Vue from "vue";

import axios from "axios";

import CategoryEditDialog from "./CategoryEditDialog.vue";
import CategoryCreationDialog from "./CategoryCreationDialog.vue";
import AssetCreationDialog from "./AssetCreationDialog.vue";

import { Category, Asset } from "../model";
import { ResponseAssetData } from "../interfaces";
import * as mutations from "../mutation-types";
import { categoryComputedMinxin } from "../store/category";

export default Vue.extend({
  props: { category: { type: Category } },
  data() {
    return {
      isShowCategoryEditDialog: false,
      isShowCategoryCreationDialog: false,
      isShowAssetCreationDialog: false
    };
  },
  computed: {
    ...categoryComputedMinxin,
    allowDelete(): boolean {
      return (
        this.categoryMetaData.childrenMap[this.category.id].length === 0 &&
        this.categoryMetaData.recurseCountMap[this.category.id] === 0
      );
    }
  },
  methods: {
    updateAssets() {
      let payload: mutations.PayloadCategoryID = { id: this.category.id };
      this.$store
        .dispatch(mutations.UPDATE_ASSETS, payload)
        .then(() => {
          this.$message({ message: "更新资产列表成功", type: "success" });
        })
        .catch(reason => {
          let message = String(reason);
          this.$notify({
            title: "获取资产列表失败",
            message,
            type: "error"
          });
        });
    },
    deleteCategory() {
      let payload: mutations.PayloadCategoryID = { id: this.category.id };
      this.$store
        .dispatch(mutations.DELETE_CATEGORY, payload)
        .then(response => {
          this.$router.push("/");
          this.$message({ message: "删除分类成功", type: "success" });
        })
        .catch(reason =>
          this.$notify({
            title: "删除分类失败",
            message: String(reason),
            type: "error"
          })
        );
    }
  },
  components: {
    CategoryEditDialog,
    CategoryCreationDialog,
    AssetCreationDialog
  }
});
</script>
<style lang="scss" scoped>
.category-toolbar {
  .el-button-group {
    display: flex;
    align-items: stretch;
    flex-wrap: wrap;
    .el-button {
      flex: 1 1 auto;
    }
  }
}
</style>