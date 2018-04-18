<template lang="pug">
el-container
  el-header(height="")
    router-link(to="/")
      img(class="logo")
  el-main
    router-view
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({});
</script>

<style lang="scss" scoped>
$header-height: 40px;
.el-header {
  background: #409eff;
  height: $header-height;
}
.el-main {
  position: absolute;
  top: $header-height;
  width: 100vw;
  height: 100%;
}
.el-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  left: 0;
  position: absolute;
  top: 0;
  overflow: hidden;
}
.logo {
  width: $header-height;
  height: $header-height;
  content: url("../logo.png");
}
</style>

 