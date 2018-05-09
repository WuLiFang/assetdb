<template lang="pug">
    el-dialog(
      v-on='dialogListeners'
      :visible="visible"
      :title='`${category.name}: 编辑`'
      
    )
      el-row
        el-col(:span="4") 
          span 父分类
        el-col(:span="20")
          el-select(v-model='category.parent_id' filterable)
            el-option(
              v-for="i in CategoryUtil.categories"
              :key="i.id"
              :label="i.name"
              :value="i.id"
              :disabled='!CategoryUtil.isLegalParent(category, i)'
              )
      el-row
        el-col(:span="4")
          span 名称
        el-col(:span="20")
          el-input(v-model='category.name')
      span(slot='footer')
        el-button(@click='reject') 取消
        el-button(@click='accept' type='primary') 确定
</template>
<script lang="ts">
import Vue from "vue";

import { Category } from "../model";
import * as mutations from "../mutation-types";
import CategoryUtil from "../category-util";

export default Vue.extend({
  props: {
    category: { type: Category },
    visible: { default: false }
  },
  data() {
    return {
      CategoryUtil
    };
  },
  computed: {
    dialogListeners(): Vue["$listeners"] {
      return this.$listeners;
    }
  },
  methods: {
    close() {
      this.$emit("update:visible", false);
    },
    reject() {
      this.close();
      this.$message("取消编辑");
    },
    accept() {
      let payload: mutations.PayloadEditCategory = {
        id: this.category.id,
        data: {
          name: this.category.name,
          parent_id: this.category.parent_id
        }
      };
      this.$store
        .dispatch(mutations.EDIT_CATEGORY, payload)
        .then(response =>
          this.$message({ message: "编辑分类成功", type: "success" })
        )
        .catch(reason =>
          this.$notify({
            title: "编辑分类失败",
            message: `${reason.response.status} ${reason.response.data}`,
            type: "error"
          })
        );
      this.close();
    }
  }
});
</script>
