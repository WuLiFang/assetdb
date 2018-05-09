<template lang="pug">
    el-dialog(
      v-on='dialogListeners'
      :visible='visible'
      :title="`${category.name}: 新子分类`"
    )
      el-row
        el-col(:span="4")
          label 名称
        el-col(:span="20")
          el-input(v-model='name')
      span(slot='footer')
        el-button(@click='reject') 取消
        el-button(@click='accept' type='primary') 确定
</template>
<script lang="ts">
import Vue from "vue";

import { Category } from "../model";
import * as mutations from "../mutation-types";

export default Vue.extend({
  props: {
    category: { type: Category },
    visible: { default: false }
  },
  data() {
    return {
      name: "未命名分类"
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
      this.$message("创建取消");
    },
    accept() {
      let payload: mutations.PayloadAddCategory = {
        name: this.name,
        parent_id: this.category.id,
        path: `${this.category.path}/${this.name}`
      };
      this.$store
        .dispatch(mutations.ADD_CATEGORY, payload)
        .then(response => {
          this.$store.dispatch(mutations.UPDATE_CATEGORIES);
        })
        .catch(reason => {
          this.$notify({
            title: "添加新分类失败",
            message: String(reason),
            type: "error"
          });
        });
      this.close();
    }
  }
});
</script>
