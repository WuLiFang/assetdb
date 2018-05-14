<template lang="pug">
  .the-admin-view
    el-button(@click='scan') 扫描文件
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

export default Vue.extend({
  methods: {
    scan() {
      return axios
        .post("/api/admin", { action: "scan" })
        .then(response => {
          this.$message({ message: response.data, type: "success" });
        })
        .catch(error => {
          this.$message({
            message: error.response ? error.response.data : String(error),
            type: "error"
          });
        });
    }
  }
});
</script>
