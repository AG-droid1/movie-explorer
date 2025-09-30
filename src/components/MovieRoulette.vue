<template>
  <div class="p-6">
    <h2 class="text-3xl font-bold mb-8 text-center text-white">Колесо фортуны</h2>

    <div class="flex flex-col md:flex-row items-start justify-center gap-12">
      <div class="wheel-area relative flex flex-col items-center">
        <button
          @click="spinRoulette"
          :disabled="isSpinning || moviesForRoulette.length === 0"
          class="spin-button absolute z-20 py-3 px-6 rounded-full text-white font-semibold transition duration-300 transform -translate-x-1/2 -translate-y-1/2"
          :class="{ 
            'bg-red-600 hover:bg-red-700': !isSpinning,
            'bg-gray-500 cursor-not-allowed': isSpinning 
          }"
          style="top: 50%; left: 50%;"
        >
          {{ isSpinning ? 'Крутится...' : 'Крутить' }}
        </button>

        <div class="indicator absolute z-10" style="top: 0px; left: 50%; transform: translateX(-50%);"></div>

        <svg 
          :width="wheelSize" 
          :height="wheelSize" 
          viewBox="0 0 100 100"
          class="roulette-wheel rounded-full border-4 border-gray-800"
          :style="wheelStyle"
        >
          <g v-for="(movie, index) in moviesForRoulette" :key="movie.imdbID + index">
            <path
              :d="getSectorPath(index)"
              :fill="movie.color"
              stroke="#1A202C"
              stroke-width="0.2"
            />
            <text
              :x="getTextCoords(index).x"
              :y="getTextCoords(index).y"
              text-anchor="middle"
              dominant-baseline="middle"
              fill="black"
              font-size="6"
              font-family="sans-serif"
              style="pointer-events: none;"
              :transform="`rotate(${index * sectorAngle + sectorAngle / 2}, ${getTextCoords(index).x}, ${getTextCoords(index).y})`"
            >
              {{ movie.Title.charAt(0) }}
            </text>
          </g>
        </svg>

        <div v-if="selectedMovie" class="text-center mt-6 p-3 bg-yellow-900 rounded-lg w-full">
          <p class="text-lg font-bold text-yellow-300">Победа:</p>
          <p class="text-xl text-white">{{ selectedMovie.Title }} ({{ selectedMovie.Year }})</p>
        </div>
      </div>

      <div class="movie-list-area bg-gray-800 p-4 rounded-lg shadow-lg w-full md:w-64 flex-shrink-0">
        <h3 class="text-xl font-bold mb-4 text-white border-b pb-2 border-gray-700">Варианты (10)</h3>
        <ul>
          <li v-for="movie in moviesForRoulette" :key="movie.imdbID" class="flex items-center py-1">
            <span 
              class="w-4 h-4 rounded-full mr-3 flex-shrink-0"
              :style="{ backgroundColor: movie.color }"
            ></span>
            <span class="text-sm text-gray-300 truncate">{{ movie.Title }}</span>
          </li>
        </ul>
      </div>
    </div>

    <p v-if="moviesForRoulette.length === 0" class="mt-8 text-center text-red-400">
      Для рулетки нужно найти фильмы (минимум 10) на главной странице.
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useMovieStore } from '@/stores/movieStore';

const store = useMovieStore();

// --- Константы и Состояние ---
const wheelSize = 400; // Размер колеса в пикселях
const spinDuration = 5; // Длительность вращения в секундах
const NUM_SECTORS = 10;
const sectorAngle = 360 / NUM_SECTORS; // 36 градусов
const center = 50; // Центр SVG viewBox (50, 50)
const radius = 50; // Радиус SVG viewBox

const moviesForRoulette = ref([]);
const isSpinning = ref(false);
const selectedMovie = ref(null);
const finalRotation = ref(0); // Вращение в градусах

// Цвета для 10 секторов
const SECTOR_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#78716c'
];

// --- Функции SVG Геометрии ---

// Вспомогательная функция для перевода полярных координат в декартовы
const polarToCartesian = (angle) => {
  const radians = (angle - 90) * Math.PI / 180.0;
  return {
    x: center + (radius * Math.cos(radians)),
    y: center + (radius * Math.sin(radians))
  };
};

// Генерация команды 'd' для сектора (Path)
const getSectorPath = (index) => {
  const startAngle = index * sectorAngle;
  const endAngle = startAngle + sectorAngle;

  const start = polarToCartesian(startAngle);
  const end = polarToCartesian(endAngle);

  // Флаги для большой дуги (largeArcFlag): 0 или 1
  const largeArcFlag = sectorAngle > 180 ? 1 : 0;

  // Команда "M (центр) L (начало дуги) A (дуга) L (центр) Z (закрыть)"
  return [
    `M ${center} ${center}`, // Move to Center
    `L ${start.x} ${start.y}`, // Line to start point
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`, // Arc to end point
    `Z` // Close path (Line to center is implicit with Z)
  ].join(' ');
};

// Координаты для размещения текста в центре сектора
const getTextCoords = (index) => {
  // Угол посередине сектора
  const midAngle = index * sectorAngle + sectorAngle / 2;
  // Расположение текста примерно на 2/3 радиуса от центра
  const textRadius = radius * 0.7; 
  const radians = (midAngle - 90) * Math.PI / 180.0;
  
  return {
    x: center + (textRadius * Math.cos(radians)),
    y: center + (textRadius * Math.sin(radians))
  };
};

// --- Инициализация и Стили ---

const wheelStyle = computed(() => ({
  transform: `rotate(${finalRotation.value}deg)`,
  transition: isSpinning.value 
    ? `transform ${spinDuration}s cubic-bezier(0.25, 0.1, 0.25, 1.0)` 
    : 'none',
}));

const loadRouletteMovies = () => {
  let movies = store.getRandomMovies(NUM_SECTORS);
  // Если фильмов меньше 10, дублируем их, чтобы колесо было полным
  if (movies.length < NUM_SECTORS) {
     movies = [...movies, ...movies].slice(0, NUM_SECTORS);
  }
  
  // Добавляем цвет и делаем фильм реактивным для рулетки
  moviesForRoulette.value = movies.map((movie, index) => ({
    ...movie,
    color: SECTOR_COLORS[index % SECTOR_COLORS.length]
  }));
  selectedMovie.value = null;
  finalRotation.value = 0;
};

onMounted(loadRouletteMovies);

// --- Логика Вращения ---

const spinRoulette = () => {
  if (isSpinning.value || moviesForRoulette.value.length !== NUM_SECTORS) return;

  isSpinning.value = true;
  selectedMovie.value = null; 

  // 1. Выбираем случайный сектор
  const winningIndex = Math.floor(Math.random() * NUM_SECTORS);
  const winningMovie = moviesForRoulette.value[winningIndex];
  
  // 2. Вычисляем целевой угол
  // Угол остановки - это угол начала сектора
  const targetAngle = winningIndex * sectorAngle;
  
  // 3. Вычисляем финальное вращение (несколько оборотов + остановка)
  const extraSpins = 10; // Больше оборотов для драмы
  
  // Компенсация: стрелка указывает на 0 градусов (верх).
  // Нам нужно вращать колесо, чтобы середина выигрышного сектора оказалась под стрелкой.
  const compensation = 360 - targetAngle - (sectorAngle / 2);

  // Вычисляем финальный угол (отрицательное значение для вращения по часовой)
  finalRotation.value = extraSpins * 360 + compensation;

  // 4. Устанавливаем выбранный фильм
  setTimeout(() => {
    selectedMovie.value = winningMovie;
    isSpinning.value = false;
    
    // Сбрасываем rotation, чтобы оно стало отрицательным (для следующего запуска)
    finalRotation.value = finalRotation.value % 360; 
  }, spinDuration * 1000);
};
</script>

<style scoped>
/* Стиль для индикатора */
.indicator {
  /* Красный треугольник SVG */
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 20px solid #E53E3E; 
}

/* Стиль для колеса */
.roulette-wheel {
  /* Начальное положение: верхняя часть сектора 0 находится на 0 градусов */
  transform: rotate(0deg);
  transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1.0);
}
</style>