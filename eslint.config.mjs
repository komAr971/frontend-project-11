import js from '@eslint/js';
import globals from 'globals';

export default [
  // Глобальные игнорируемые файлы
  {
    ignores: ['dist/*', 'node_modules/*', '*.config*'],
  },
  // Конфигурация для JS-файлов
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.browser, // Добавляем глобальные переменные браузера
      },
    },
    ...js.configs.recommended, // Расширяем рекомендуемую конфигурацию JS
  },
];