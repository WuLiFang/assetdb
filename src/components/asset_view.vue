<template lang="pug">
  div
    table(v-if="assets.length > 0")
      div {{category.name}} 资产:
        ul(v-for='asset in assets', :key='asset.id')
          li {{asset.name}}
    div(v-else, v-html="message") 
</template>


<script lang="ts">
import Vue from "vue";
import axios from "axios";
import { functionDeclaration } from "babel-types";
import { Category, Asset } from "../model";

export default Vue.extend({
  props: ["category"],
  data() {
    return {
      assets: new Array<Asset>(),
      message: ""
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
      this.message = "读取中...";
      axios.get(`/api/category/${this.category.id}/assets`).then(
        response => {
          (<Array<Array<string>>>response.data).forEach(element => {
            let asset = Asset.from_data(element);
            assets.push(asset);
          });
          this.message = "<此分类下无资产>";
        },
        reason => {
          let msg = reason.body;
          if (!msg) {
            msg = reason;
          }
          this.message = msg;
        }
      );
    }
  },
  created() {
    this.updateAssets();
  }
});
</script>
