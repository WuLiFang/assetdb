<template lang="pug">
  .category-toolbar
    el-button-group(class="toolbar")
      el-button(icon="el-icon-refresh" @click='updateAssets') 刷新
      el-button(icon="el-icon-plus" @click='isShowDialog = true') 新资产
    el-dialog(title="创建新资产" :visible.sync="isShowDialog")
      el-form(:model="assetForm" )
        el-form-item(label="名称")
          el-input(v-model="assetForm.name", placeholder="默认使用文件名")
        el-form-item(label="描述")
          el-input(v-model="assetForm.description")
        el-upload(drag multiple class="uploader" :action='`api/category/${category.id}`' :file-list="fileList" :on-error="onUploadError" :on-success="onUploadSuccess" auto-upload=false :data="assetForm")
          i(class="el-icon-upload")
          div(class="el-upload__text") 拖拽上传,或
            em 点击上传
</template>
<script lang="ts">
import Vue from "vue";

import axios from "axios";

import { Category, Asset } from "../model";
import { ResponseAssetData } from "../interfaces";

export default Vue.extend({
  props: ["category"],
  data() {
    return {
      assets: new Array<Asset>(),
      message: "",
      isLoading: true,
      isShowDialog: false,
      assetForm: {
        name: "",
        description: ""
      },
      fileList: []
    };
  },
  watch: {
    category: function(newValue, oldValue) {
      this.updateAssets();
    }
  },
  methods: {
    updateAssets() {
      let assets: Array<Asset> = [];
      this.assets = assets;
      this.isLoading = true;
      this.message = "读取中...";
      axios
        .get(`/api/category/${this.category.id}/assets`)
        .then(response => {
          (<Array<ResponseAssetData>>response.data).forEach(element => {
            let asset = Asset.from_data(element);
            assets.push(asset);
          });
          this.message = "<此分类下无资产>";
          this.isLoading = false;
        })
        .catch(reason => {
          let message = String(reason);
          this.message = message;
          this.$notify({
            title: "获取资产列表失败",
            message,
            type: "error"
          });
          this.isLoading = false;
        });
    },
    createAsset() {
      this.isShowDialog = false;
      console.log(this.fileList);
    },
    onUploadError(error: any, fileList: Array<any>) {
      this.$notify({
        type: "error",
        message: String(error),
        title: "上传失败"
      });
      console.log(fileList);
      return;
    },
    onUploadSuccess() {
      this.assetForm.name = "";
    }
  },
  created() {
    this.updateAssets();
  }
});
</script>
<style lang="scss" scoped>
.toolbar {
  display: flex;
  justify-content: flex-end;
  flex: 0 0 auto;
}
</style>