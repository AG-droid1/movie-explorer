<template>
  <div class="p-4">
    <div v-if="loading" class="text-center mt-12">
      Загрузка...
    </div>
    <div v-else-if="movie" class="max-w-4xl mx-auto bg-gray-700 rounded-lg shadow-xl p-8 flex flex-col md:flex-row">
      <div class="md:w-1/3 flex-shrink-0">
        <img :src="movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.png'" :alt="movie.Title" class="w-full rounded-lg shadow-md"  @error="e => e.target.src = '/placeholder.png'" />
      </div>
      <div class="md:w-2/3 md:pl-8 mt-6 md:mt-0">
        <h1 class="text-4xl font-bold mb-2">{{ movie.Title }}</h1>
        <p class="text-xl text-gray-400 mb-4">{{ movie.Year }}</p>
        
        <p class="mb-2"><span class="font-bold">Жанр:</span> {{ movie.Genre }}</p>
        <p class="mb-2"><span class="font-bold">Режиссёр:</span> {{ movie.Director }}</p>
        <p class="mb-2"><span class="font-bold">Актёры:</span> {{ movie.Actors }}</p>
        <p class="mb-4"><span class="font-bold">Рейтинг IMDb:</span> {{ movie.imdbRating }}</p>

        <button 
          @click="favoritesStore.addToFavorites(movie)"
          :class="{
            'bg-blue-600 hover:bg-blue-700': !favoritesStore.isFavorite(movie.imdbID),
            'bg-gray-500 cursor-not-allowed': favoritesStore.isFavorite(movie.imdbID)
          }"
          :disabled="favoritesStore.isFavorite(movie.imdbID)"
          class="p-2 mb-2 rounded-lg text-white transition duration-300"
        >
          {{ favoritesStore.isFavorite(movie.imdbID) ? 'Уже в избранном' : 'Добавить в избранное' }}
        </button>

        <p class="text-gray-300">{{ movie.Plot }}</p>
      </div>
    </div>
    <div v-else class="text-center mt-12">
      Фильм не найден.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useMovieStore } from '@/stores/movieStore';
import { useFavoritesStore } from '@/stores/favoritesStore';

const movie = ref(null);
const loading = ref(false);
const route = useRoute();
const store = useMovieStore();
const favoritesStore = useFavoritesStore();

const fetchMovieDetail = async (id) => {
  loading.value = true;
  try {
    const url = `https://www.omdbapi.com/?i=${id}&apikey=${import.meta.env.VITE_OMDB_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.Response === 'True') {
      movie.value = data;
    } else {
      movie.value = null;
    }
  } catch (err) {
    console.error('Ошибка при получении деталей фильма:', err);
    movie.value = null;
  } finally {
    loading.value = false;
  }
};


onMounted(() => {
  const movieId = route.params.id;
  if (movieId) {
    fetchMovieDetail(movieId);
  }
});
</script>