// src/index.ts

import Vue from "vue";
import CategoryComponent from "./components/category.vue";
import VueResource from 'vue-resource';

Vue.use(VueResource);

new Vue({
    el: "#app",
    template: `
    <div>
        <category-component v-for='name in names' :key="name" :name="name"/>
    </div>
    `,
    data() {
        this.$http.get('/api/category').then(
            response => {
                this.$set(this, 'names', response.data)
            }
        )
        return { names: [] }
    },
    components: {
        CategoryComponent
    }
});