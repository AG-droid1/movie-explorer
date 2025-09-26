import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFavoritesStore = defineStore('favorites', () => {
  // state
  const favorites = ref([]);

  // actions
  const addToFavorites = (movie) => {
    const exists = favorites.value.some(fav => fav.imdbID === movie.imdbID);
    if (!exists) {
      favorites.value.push(movie);
      console.log('Добавлен в избранное:', movie.Title);
    }
  };

  const removeFromFavorites = (movieId) => {
    favorites.value = favorites.value.filter(fav => fav.imdbID !== movieId);
    console.log('Удален из избранного:', movieId);
  };
  
  // getter
  const isFavorite = (movieId) => {
    return favorites.value.some(fav => fav.imdbID === movieId);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };
});