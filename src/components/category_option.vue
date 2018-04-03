<template lang="pug">
option(:label="category.label") {{ category.name }}
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: ["category"],
});
</script>

<style lang="scss" scoped>
div {
  background-color: grey;
  max-width: 200px;
}
</style>
 