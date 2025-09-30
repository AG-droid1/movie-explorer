import { defineStore } from 'pinia';
import { ref,computed } from 'vue';

const STORAGE_KEY = 'movieExplorerFavorites';

const loadFavorites = () => {
  try {
    const serializedFavorites = localStorage.getItem(STORAGE_KEY);
    return serializedFavorites ? JSON.parse(serializedFavorites) : [];
  } catch (e) {
    console.error('Ошибка загрузки избранного из localStorage:', e);
    return [];
  }
};

const saveFavorites = (favoritesArray) => {
  try {
    const serializedFavorites = JSON.stringify(favoritesArray);
    localStorage.setItem(STORAGE_KEY, serializedFavorites);
  } catch (e) {
    console.error('Ошибка сохранения избранного в localStorage:', e);
  }
};

export const useFavoritesStore = defineStore('favorites', () => {
  // state
  const favorites = ref(loadFavorites());

  // actions
  const addToFavorites = (movie) => {
    const exists = favorites.value.some(fav => fav.imdbID === movie.imdbID);
    if (!exists) {
      favorites.value.push(movie);
      saveFavorites(favorites.value);
      console.log('Добавлен в избранное:', movie.Title);
    }
  };

  const removeFromFavorites = (movieId) => {
    favorites.value = favorites.value.filter(fav => fav.imdbID !== movieId);
    saveFavorites(favorites.value);
    console.log('Удален из избранного:', movieId);
  };
  
  // getter
  const isFavorite = (movieId) => {
    return favorites.value.some(fav => fav.imdbID === movieId);
  };
  const favoritesCount = computed(() => {
    return favorites.value.length;
  });

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    favoritesCount,
  };
});