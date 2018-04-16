<template lang="pug">
  div(v-loading='isLoading')
    table(v-if="assets.length > 0")
      div {{category.name}} 资产:
        asset-card(v-for='asset in assets', :key='asset.id', :asset="asset")
    div(v-else, v-html="message") 
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
      isLoading: true
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
