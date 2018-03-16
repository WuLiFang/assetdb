import Vue from "vue";
import CategoryComponent from "./components/category.vue";
import VueResource from 'vue-resource';
import { Category } from './model';

Vue.use(VueResource);

new Vue({
    el: "#app",
    template: `
    <div>
        <category-component v-for='category in categories' :key="category.id" :category="category"/>
    </div>
    `,
    data() {
        this.$http.get('/api/category').then(
            response => {
                let categories: Category[] = [];
                response.data.forEach((data: string[]) => {
                    categories.push(Category.from_data(data))
                });
                this.$set(this, 'categories', categories)
            }
        )
        return { categories: [] }
    },
    components: {
        CategoryComponent
    }
});