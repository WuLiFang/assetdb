<template lang="pug">
  el-transfer(v-model='selected' :data='data')
</template>

<script lang="ts">
import Vue from "vue";

import * as _ from "lodash";
import { ElTransfer } from "element-ui/types/transfer";

import { Asset } from "../model";
import FileUtil from "../file-util";

export default Vue.extend({
  props: {
    asset: { type: Asset }
  },
  computed: {
    data(): ElTransfer["data"] {
      return _.map(FileUtil.storage, value => ({
        label: value.label,
        key: value.id,
        disabled: false
      }));
    }
  }
});
</script>
