<template lang="pug">
  div {{ category.name }}
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: ["category"],
  data() {
    return {
      category: this.category
    };
  }
});
</script>

<style lang="sass" scoped>
</style>
 