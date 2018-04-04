<template lang="pug">
  table
    div {{category.name}} assets:
</template>


<script lang="ts">
import Vue from "vue";
import { functionDeclaration } from "babel-types";
import { Category } from "../model";
export default Vue.extend({
  props: ["category"]
});
</script>
