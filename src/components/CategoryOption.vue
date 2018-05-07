<template lang="pug">
option(:label="category.name") {{ category.id }}
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: ["category"]
});
</script>

<style lang="scss" scoped>
div {
  background-color: grey;
  max-width: 200px;
}
</style>
 