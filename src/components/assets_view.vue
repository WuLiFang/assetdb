<template lang="pug">
  div
    el-container
      el-header(height="25px")
        div(class="toolbar")
          el-button(icon="el-icon-refresh" @click='updateAssets') 刷新
          el-button(icon="el-icon-plus" @click='isShowDialog = true') 新资产
      el-main(v-loading='isLoading')
        div(v-if="assets.length > 0" class="cards")
          asset-card(v-for='asset in assets', :key='asset.id', :asset="asset")
        div(v-else, v-html="message")

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
import { functionDeclaration } from "babel-types";
import { Category, Asset } from "../model";
import AssetCard from "./asset_card.vue";

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
          (<Array<Array<string>>>response.data).forEach(element => {
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
  },
  components: {
    AssetCard
  }
});
</script>
<style lang="scss" scoped>
.cards {
  column-width: 200px;
  column-gap: 10px;
}
.toolbar {
  text-align: right;
}
.uploader {
  width: 100%;
  overflow: hidden;
}
</style>
<style lang="scss">
.el-upload.el-upload--text {
  width: 100%;
  .el-upload-dragger {
    width: 100%;
  }
}
</style>
