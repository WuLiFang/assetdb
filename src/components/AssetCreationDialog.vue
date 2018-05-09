<template lang="pug">
    el-dialog(
      v-on='dialogListeners'
      :visible='visible'
      :title='`${category.name}: 创建新资产`'
    )
      el-form(:model="assetForm" )
        el-form-item(label="名称")
          el-input(v-model="assetForm.name", placeholder="默认使用文件名")
        el-form-item(label="描述")
          el-input(v-model="assetForm.description")
        el-upload(
          drag
          multiple
          class="uploader"
          :action='`api/category/${category.id}`'
          :file-list="fileList"
          :on-error="onUploadError"
          :on-success="onUploadSuccess"
          auto-upload=false
          :data="assetForm"
        )
          i(class="el-icon-upload")
          div(class="el-upload__text") 拖拽上传,或
            em 点击上传
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
    addSubCategory(category: Category) {
      console.log(parent);
      return this.$prompt("名称", `${category.name}: 新子分类`, {
        inputPattern: /.+/,
        inputErrorMessage: "请输入名称"
      })
        .then(data => {
          if (typeof data == "string") {
            return;
          }
          let name = data.value;
          let parent_id = category.id;
          let path = `${category.path}/${name}`;
          let payload: mutations.PayloadAddCategory = {
            name: data.value,
            parent_id: category.id,
            path
          };
          this.$store
            .dispatch(mutations.ADD_CATEGORY, payload)
            .then(response => {
              this.$store.dispatch(mutations.UPDATE_CATEGORIES);
            })
            .catch(reason => {
              this.$notify({
                title: "添加新分类失败",
                message: `${reason.response.status} ${reason.response.data}`,
                type: "error"
              });
            });
        })
        .catch(() => {
          this.$message("创建取消");
        });
    },
    onUploadSuccess() {
      this.assetForm.name = "";
    },
    onUploadError(error: any, fileList: Array<any>) {
      this.$notify({
        type: "error",
        message: String(error),
        title: "上传失败"
      });
      console.log(fileList);
      return;
    }
  }
});
</script>
