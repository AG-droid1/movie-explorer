<template>
  <header class="bg-gray-900 text-white p-4 shadow-lg sticky top-0 z-50">
    <div class="container mx-auto flex justify-between items-center">
      <RouterLink to="/" class="text-2xl font-bold tracking-wide hover:text-blue-400 transition-colors duration-300">
        КиноПоиск
      </RouterLink>

      <nav>
        <ul class="flex space-x-4">
          <li>
            <RouterLink to="/" class="text-lg hover:text-blue-400 transition-colors duration-300">
              Поиск
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/favorites" class="relative pr-2 text-lg  hover:text-blue-400 transition-colors duration-300">
              Избранное
              <span 
            v-if="favoritesStore.favoritesCount > 0"
            class="absolute -top-2 -right-3  bg-red-600 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
          >
            {{ favoritesStore.favoritesCount }}
          </span>
            </RouterLink>
            </li>
            <li>
            <RouterLink 
            :to="{ name: 'roulette' }" 
            class="text-lg hover:text-blue-400 transition"
          >
            Рулетка 🎲
          </RouterLink>
          </li>
          </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useFavoritesStore } from '@/stores/favoritesStore';


const favoritesStore = useFavoritesStore();
</script>