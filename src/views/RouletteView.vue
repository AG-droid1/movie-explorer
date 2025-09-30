<template>
  <div class="p-6">
    <div v-if="store.movies.length > 0">
      <div class="flex justify-center">
        <MovieRoulette />
      </div>
    </div>
    <div v-else class="text-center mt-20 p-8 bg-gray-700 rounded-lg max-w-lg mx-auto">
      <h2 class="text-2xl font-bold mb-4 text-red-400">Нет фильмов для рулетки</h2>
      <p class="text-gray-300">Пожалуйста, вернитесь на главную страницу и выполните поиск, чтобы заполнить список фильмов.</p>
      <RouterLink to="/" class="mt-4 inline-block py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Начать поиск
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { useMovieStore } from '@/stores/movieStore';
import MovieRoulette from '@/components/MovieRoulette.vue';
import { RouterLink } from 'vue-router';

const store = useMovieStore();
</script>