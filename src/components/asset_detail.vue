<template lang="pug">
  div {{asset.name}} WIP
</template>

<script lang="ts">
import Vue from "vue";
import { Asset } from "../model";
export default Vue.extend({
  props: {
    asset: {
      type: Asset
    }
  }
});
</script>
