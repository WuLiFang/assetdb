<template lang="pug">
    el-dialog(
      v-on='dialogListeners'
      :visible='visible'
      :title='`${category.name}: 创建新资产`'
    )
      el-form(:model="assetForm" label-width='80px')
        el-form-item(label="名称")
          el-input(v-model="assetForm.name")
        el-form-item(label="描述")
          el-input(v-model="assetForm.description")
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
      assetForm: {
        name: "",
        description: ""
      },
      fileList: []
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
      let category_id = this.category.id;
      let payload: mutations.PayloadAddAsset = {
        ...this.assetForm,
        category_id
      };
      this.$store
        .dispatch(mutations.ADD_ASSET, payload)
        .then(response => {
          this.$message({ message: "添加新资产成功", type: "success" });
        })
        .catch(reason => {
          this.$notify({
            title: "添加新资产失败",
            message: String(reason),
            type: "error"
          });
        });
      this.close();
    }
  }
});
</script>
