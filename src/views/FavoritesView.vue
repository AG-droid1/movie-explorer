<template>
  <div class="p-4">
    <h1 class="text-3xl font-bold mb-6 text-center">Избранные фильмы</h1>
    <div v-if="favoritesStore.favorites.length > 0" class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div v-for="movie in favoritesStore.favorites" :key="movie.imdbID" class="bg-gray-700 rounded-lg shadow-md overflow-hidden relative">
        <button
          @click="favoritesStore.removeFromFavorites(movie.imdbID)"
          class="absolute top-2 right-2 p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
          aria-label="Удалить из избранного"
        >
          &times;
        </button>
        <img :src="movie.Poster" :alt="movie.Title" class="w-full h-64 object-cover" />
        <div class="p-4">
          <h2 class="text-lg font-bold">{{ movie.Title }}</h2>
          <p class="text-sm text-gray-400">{{ movie.Year }}</p>
        </div>
      </div>
    </div>
    <div v-else class="text-center mt-8 text-gray-400">
      У вас пока нет избранных фильмов.
    </div>
  </div>
</template>

<script setup>
import { useFavoritesStore } from '@/stores/favoritesStore';

const favoritesStore = useFavoritesStore();
</script>