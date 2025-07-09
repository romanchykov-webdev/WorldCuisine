export function getDeviceType(width) {
  if (width >= 1024) {
    return 6 // Ширина экрана для ПК
  }
  else if (width >= 768 && width < 1024) {
    return 4 // Ширина экрана для планшета
  }
  else {
    return 2 // Ширина экрана для мобильных устройств
  }
}

// Пример использования:
const screenWidth = window.innerWidth // Получаем ширину экрана в браузере
const deviceType = getDeviceType(screenWidth)
// console.log(`Your device is: ${deviceType}`);
