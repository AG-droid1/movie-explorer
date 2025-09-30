import { defineStore } from 'pinia';
import { ref,computed} from 'vue';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export const useMovieStore = defineStore('movie', () => {
  //state
  const movies = ref([]);
  const loading = ref(false);
  const error = ref(null); 
  const totalResults = ref(0); 
  const currentPage = ref(1);
  const sortKey = ref(null); 
  const sortDirection = ref('asc');
  const typeFilter = ref('');

   //getter
  const sortedMovies = computed(() => {
    if (!sortKey.value) {
      return movies.value; 
    }
    const sorted = [...movies.value].sort((a, b) => {
      let valA = a[sortKey.value];
      let valB = b[sortKey.value];
      if (sortKey.value === 'Year' || sortKey.value === 'imdbRating') {
        valA = parseFloat(valA) || 0;
        valB = parseFloat(valB) || 0;
      }
      if (valA < valB) return sortDirection.value === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection.value === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  });

  //actions
    const setTypeFilter = (type) => {
      typeFilter.value = type;
    };

  const searchMovies = async (title, page = 1) => {
    if (!title) {
        movies.value = []; 
      totalResults.value = 0;
      currentPage.value = 1;
      return;
    }

    loading.value = true;
    error.value = null;
    
    try {
      let url = `https://www.omdbapi.com/?s=${title}&apikey=${API_KEY}&page=${page}`;
      if (typeFilter.value) { 
        url += `&type=${typeFilter.value}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === 'True') {
        movies.value = data.Search;
        totalResults.value = parseInt(data.totalResults,10);
      } else {
        movies.value = [];
        error.value = 'Фильмы не найдены. Попробуйте другой запрос.';
      }
    } catch (err) {
      console.error('Ошибка при поиске фильмов:', err);
      error.value = 'Произошла ошибка при получении данных.';
    } finally {
      loading.value = false;
    }
  };

   const setSort = (key) => {
    if (sortKey.value === key) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey.value = key;
      sortDirection.value = 'asc';
    }
  };

const getRandomMovies = (count = 10) => {
    if (movies.value.length < count) {
      return [...movies.value]; 
    }
    const shuffled = [...movies.value]
      .sort(() => 0.5 - Math.random()); 
    return shuffled.slice(0, count);
  };

   


  return {
    movies,
    loading,
    error,
    totalResults,
    currentPage,
    searchMovies,
    sortedMovies,
    setSort,
    getRandomMovies,
    typeFilter,
    setTypeFilter
  };
});