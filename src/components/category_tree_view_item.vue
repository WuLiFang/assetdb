<template lang="pug">
  li(v-if="category")
    router-link(:to="category.url()")
      span(:class="{current: isCurrent}") {{category.name}}
    ul
      category-tree-view-item(v-for="item in children" v-show="isOpen" :key="item.id" :category="item")
    el-button(v-if="isCurrent" icon="el-icon-plus" @click='addSubCategory' size='mini') 新子分类
</template>

<script lang="ts">
import Vue from "vue";
import * as _ from "lodash";
import axios from "axios";
import { Category, CategoryStorage } from "../model";
import { UPDATE_CATEGORIES } from "../mutation-types";

export default Vue.extend({
  name: "category-tree-view-item",
  props: {
    category: { type: Category, default: null }
  },
  computed: {
    categories(): CategoryStorage {
      return this.$store.state.categories;
    },
    children(): Category[] {
      let category = this.category;
      if (category) {
        let id = category.id;
        return this.categories.filter(value => {
          return value.parent_id == id;
        });
      }
      return [];
    },
    id(): string {
      return this.$route.params.id;
    },
    isCurrent(): boolean {
      if (!this.category) {
        return false;
      }
      return this.id == this.category.id;
    },
    isOpen(): boolean {
      if (!this.category) {
        return false;
      }
      let isCurrent = (id: string): boolean => {
        if (id == this.id) {
          return true;
        }
        let children = _.filter(
          this.categories,
          value => value.parent_id == id
        );
        let current = _.find(children, value => isCurrent(value.id));
        return Boolean(current);
      };
      return isCurrent(this.category.id);
    }
  },
  methods: {
    addSubCategory() {
      if (!this.category) {
        return;
      }
      let category = this.category;
      this.$prompt("名称", "创建新分类", {
        inputPattern: /.+/,
        inputErrorMessage: "请输入名称"
      })
        .then(data => {
          if (typeof data == "string") {
            return;
          }
          let name = data.value;
          let parent_id = category.id;
          let path = `${category.path}/${name}`;
          axios
            .post(`/api/category`, { name, parent_id, path })
            .then(response => {
              this.$store.commit(UPDATE_CATEGORIES);
            })
            .catch(reason => {
              let message: string;
              try {
                message = `${reason.response.status} ${reason.response.data}`;
              } catch (error) {
                console.warn("Parse fail reson failed." + error);
                message = String(reason);
              }
              this.$notify({ title: "添加新分类失败", message, type: "error" });
            });
        })
        .catch(() => {
          this.$message("创建取消");
        });
    }
  }
});
</script>

<style lang="scss" scoped>
.current {
  text-decoration: underline;
  font-weight: bold;
}
a {
  text-decoration: none;
  color: black;
}
ul {
  padding-left: 15px;
}
</style>
 