<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-6 text-center">Поиск фильмов</h1>
    <div class="max-w-xl mx-auto">
      <form @submit.prevent="handleSearch" class="flex items-center space-x-2">
        <input
          v-model="searchTitle"
          type="text"
          placeholder="Найти фильм..."
          class="flex-1 p-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          :value="store.typeFilter"
          @change="handleTypeChange($event.target.value)"
          class="p-3 rounded-lg border-2 border-gray-700 bg-gray-900 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="">Все типы</option>
          <option value="movie">Фильмы</option>
          <option value="series">Сериалы</option>
          <option value="episode">Эпизоды</option>
        </select>

        <button
          type="submit"
          class="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
        >
          Поиск
        </button>
      </form>

      <div v-if="store.movies.length > 0" class="mt-4 flex space-x-4 text-gray-400">
        <button @click="store.setSort('Title')" class="hover:text-white transition-colors">
          Название
        </button>
        <button @click="store.setSort('Year')" class="hover:text-white transition-colors">
          Год
        </button>
      </div>

      <div v-if="store.loading" class="text-center mt-8">
        Загрузка...
      </div>
      <div v-else-if="store.error" class="text-center mt-8 text-red-400">
        {{ store.error }}
      </div>
      <div v-else-if="store.movies.length > 0" class="mt-8">
         <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    
        <RouterLink
        v-for="movie in store.sortedMovies"
        :key="movie.imdbID"
        :to="{ name: 'movie-detail', params: { id: movie.imdbID } }"
         class="bg-gray-700 rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform duration-300"
        >
        <img :src="movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.png'" :alt="movie.Title" class="w-full h-64 object-cover"  @error="e => e.target.src = '/placeholder.png'" />
        <div class="p-4">
          <h2 class="text-lg font-bold">{{ movie.Title }}</h2>
          <p class="text-sm text-gray-400">{{ movie.Year }}</p>
        </div>
</RouterLink>
      </div>

    <div class="flex justify-center items-center mt-8 space-x-4">
          <button
            @click="goToPage(store.currentPage - 1)"
            :disabled="store.currentPage <= 1"
            class="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
            :class="{ 'opacity-50 cursor-not-allowed': store.currentPage <= 1 }"
          >
            &larr; Назад
          </button>
          
          <span class="text-lg font-semibold">Страница {{ store.currentPage }}</span>

          <button
            @click="goToPage(store.currentPage + 1)"
            :disabled="store.currentPage * 10 >= store.totalResults"
            class="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
            :class="{ 'opacity-50 cursor-not-allowed': store.currentPage * 10 >= store.totalResults }"
          >
            Вперёд &rarr;
          </button>
        </div>
      </div>

      <div v-else-if="searchPerformed" class="text-center mt-8 text-gray-400">
        <p>Фильмы не найдены. Попробуйте другой запрос.</p>
      </div>

      <div v-else class="text-center mt-8 text-gray-400">
        <p>Используйте поиск, чтобы найти фильмы и сериалы.</p>
      </div>
    </div>




  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMovieStore } from '@/stores/movieStore';



const searchTitle = ref('');
const store = useMovieStore();
const searchPerformed = ref(false);

const handleSearch = () => {
    searchPerformed.value = true;
    store.searchMovies(searchTitle.value, 1);
};
const handleTypeChange = (type) => {
  store.setTypeFilter(type);
  store.searchMovies(searchTitle.value, 1); 
};
const goToPage = (page) => {
  store.searchMovies(searchTitle.value, page);
};
</script>