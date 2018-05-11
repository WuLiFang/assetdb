<template lang="pug">
    div.category-assets-view
      div(v-if="assets.length === 0") 空的
      AssetCard(v-for='asset in assets', :key='asset.id', :asset="asset")
</template>

<script lang="ts">
import Vue from "vue";
import * as _ from "lodash";

import AssetCard from "./AssetCard.vue";

import { Category, Asset } from "../model";
import * as mutations from "../mutation-types";
import { assetComputedMinxin } from "../store/asset";

export default Vue.extend({
  props: {
    category: { type: Category }
  },
  data() {
    return {
      assets: new Array<Asset>(),
      isLoading: true,
      isShowDialog: false,
      assetForm: {
        name: "",
        description: ""
      },
      fileList: []
    };
  },
  computed: {
    ...assetComputedMinxin
  },
  watch: {
    category: function(newValue, oldValue) {
      this.updateAssets();
    }
  },
  methods: {
    updateAssets() {
      this.isLoading = true;
      let payload: mutations.PayloadCategoryID = { id: this.category.id };
      this.$store
        .dispatch(mutations.UPDATE_ASSETS, payload)
        .then(response => {
          this.assets = _.filter(
            this.assetStore.storage,
            value => value.category_id == this.category.id
          );
          this.isLoading = false;
        })
        .catch(reason => {
          this.$notify({
            title: "读取资产失败",
            message: `${reason.response.status} ${reason.response.data}`,
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
.category-assets-view {
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
