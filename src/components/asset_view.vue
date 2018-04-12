<template lang="pug">
  div
    div(v-if="loading") 读取中...
    table(v-else)
      div(v-if="assets.length > 0") {{category.name}} assets:
        ul(v-for='asset in assets', :key='asset.id')
          li {{asset.name}}
      div(v-else) &lt此分类下无资产&gt
</template>


<script lang="ts">
import Vue from "vue";
import { functionDeclaration } from "babel-types";
import { Category, Asset } from "../model";
export default Vue.extend({
  props: ["category"],
  data() {
    return {
      loading: true,
      assets: new Array<Asset>()
    };
  },
  watch: {
    category: function(newValue, oldValue) {
      this.updateAssets();
    }
  },
  methods: {
    updateAssets() {
      this.loading = true;
      let assets: Array<Asset> = [];
      this.assets = assets;
      this.$http
        .get(`/api/category/${this.category.id}/assets`)
        .then(response => {
          (<Array<Array<string>>>response.data).forEach(element => {
            let asset = Asset.from_data(element);
            assets.push(asset);
          });
        });
      this.loading = false;
    }
  },
  created() {
    this.updateAssets();
  }
});
</script>
