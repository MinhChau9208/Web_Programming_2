<template>
  <div>
    <h1>Dictionary</h1>
    <input id= "searchbar" type="text" v-model="searchQuery" placeholder="Search a word..." @input="onSearch" />
    <table id="words" class="ui celled compact table">
      <thead>
        <tr>
          <th>English</th>
          <th>German</th>
          <th>French</th>
          <th>Vietnamese</th>
          <th colspan="3"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(word, i) in paginatedWords" :key="i">
          <td>{{ word.english }}</td>
          <td>{{ word.german }}</td>
          <td>{{ word.french }}</td>
          <td>{{ word.vietnamese }}</td>
          <td width="75" class="center aligned">
            <router-link :to="{ name: 'show', params: { id: word._id }}">Show</router-link>
          </td>
          <td width="75" class="center aligned">
            <router-link :to="{ name: 'edit', params: { id: word._id }}">Edit</router-link>
          </td>
          <td width="75" class="center aligned" @click.prevent="onDestroy(word._id)">
            <a :href="`/words/${word._id}`">Delete</a>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="changePage(page - 1)" :disabled="page <= 1">Previous</button>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <button @click="changePage(page + 1)" :disabled="page >= totalPages">Next</button>
    </div>
  </div>
</template>

<style scoped>
#searchbar {
  right: 0px;
  margin-bottom: 20px;
  float: right;
}
.pagination {
  margin-top: 20px;
  text-align: center;
}

.pagination button {
  border: none;
  border-radius: 10%;
  background-color: aqua;
  height: 30px;
  width: 80px;
  margin: 0 5px;
}
</style>

<script>
import { api } from '../helpers/helpers';

export default {
  name: 'words',
  data() {
    return {
      words: [],
      searchQuery: '',
      page: 1,
      itemsPerPage: 10,
      totalPages: 1,
    };
  },
  computed: {
    paginatedWords() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.words.slice(start, end);
    },
  },
  methods: {
    async onDestroy(id) {
      const sure = window.confirm('Are you sure?');
      if (!sure) return;
      await api.deleteWord(id);
      this.flash('Word deleted successfully!', 'success');
      this.words = this.words.filter(word => word._id !== id);
      this.calculateTotalPages();
    },
    async onSearch() {
      const response = await api.searchWords(this.searchQuery);
      this.words = response;
      this.calculateTotalPages();
    },
    changePage(newPage) {
      if (newPage < 1 || newPage > this.totalPages) return;
      this.page = newPage;
    },
    async fetchWords() {
      const response = await api.getWords();
      this.words = response;
      this.calculateTotalPages();
    },
    calculateTotalPages() {
      this.totalPages = Math.ceil(this.words.length / this.itemsPerPage);
    }
  },
  async mounted() {
    await this.fetchWords();
  },
};
</script>
