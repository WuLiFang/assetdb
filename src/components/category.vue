<template lang="pug">
  div {{ name }}
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: ["name"],
  data() {
    return {
      name: this.name
    };
  }
});
</script>

<style lang="sass" scoped>
</style>
 