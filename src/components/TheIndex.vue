<template lang="pug">
.app
  header(height="")
    router-link(to="/")
      img(class="logo")
  router-view.router-view
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({});
</script>

<style lang="scss" scoped>
@import "./variables.scss";

.app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  left: 0;
  position: absolute;
  top: 0;
  overflow: hidden;

  header {
    background: #409eff;
    height: $header-height;
    .logo {
      width: $header-height;
      height: $header-height;
      content: url("../logo.png");
    }
  }
  .router-view {
    top: $header-height;
    height: 100%;
    width: 100vw;
    @media (min-width: $fullscreen-layout-min-width) {
      position: absolute;
      height: initial;
      bottom: 0;
    }
  }
}
</style>

 