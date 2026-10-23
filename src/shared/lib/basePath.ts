/**
 * Путь, под которым опубликовано приложение: '/' в dev, '/test-Aezakmi' на GitHub Pages.
 * Без слэша в конце — так он подходит и для basename роутера, и для path куки.
 */
export const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'
