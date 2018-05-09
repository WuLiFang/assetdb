<template lang="pug">
  .asset-manage-pane 
    AssetToolbar(:asset='asset')
    AssetFileTable(:asset='asset')
</template>

<script lang="ts">
import Vue from "vue";

import AssetToolbar from "./AssetToolbar.vue";
import AssetFileTable from "./AssetFileTable.vue";
import { Asset } from "../model";

export default Vue.extend({
  props: {
    asset: { type: Asset }
  },
  components: {
    AssetToolbar,
    AssetFileTable
  }
});
</script>
