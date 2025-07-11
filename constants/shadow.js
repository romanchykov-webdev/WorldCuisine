// Утилита для тени текста (основная)
export function shadowText({
  color = 'rgba(0, 0, 0, 0.75)', // Цвет тени текста (по умолчанию чёрный с прозрачностью)
  offset = { width: 2, height: 2 }, // Смещение тени по горизонтали и вертикали (по умолчанию 2px)
  radius = 3, // Радиус размытия тени (по умолчанию 3px)
} = {}) {
  return {
    textShadowColor: color, // Устанавливаем цвет тени
    textShadowOffset: offset, // Устанавливаем смещение тени
    textShadowRadius: radius, // Устанавливаем радиус размытия тени
  }
}
export function shadowTextSmall({
  color = 'rgba(0, 0, 0, 1)', // Цвет тени текста (по умолчанию чёрный с прозрачностью)
  offset = { width: 1, height: 1 }, // Смещение тени по горизонтали и вертикали (по умолчанию 2px)
  radius = 1, // Радиус размытия тени (по умолчанию 3px)
} = {}) {
  return {
    textShadowColor: color, // Устанавливаем цвет тени
    textShadowOffset: offset, // Устанавливаем смещение тени
    textShadowRadius: radius, // Устанавливаем радиус размытия тени
  }
}

export function shadowBoxBlack({
  color = '#000', // Цвет тени для блоков (по умолчанию чёрный)
  offset = { width: 0, height: 4 }, // Смещение тени по горизонтали и вертикали (по умолчанию вниз на 4px)
  opacity = 0.3, // Прозрачность тени (по умолчанию 30%)
  radius = 5, // Радиус размытия тени (по умолчанию 5px)
  elevation = 6, // Высота "подъема" для создания тени на Android (по умолчанию 6)
} = {}) {
  return {
    shadowColor: color, // Устанавливаем цвет тени для iOS
    shadowOffset: offset, // Устанавливаем смещение тени для iOS
    shadowOpacity: opacity, // Устанавливаем прозрачность тени для iOS
    shadowRadius: radius, // Устанавливаем радиус размытия тени для iOS

    elevation, // Устанавливаем высоту тени для Android
  }
}

export function shadowBoxWhite({
  color = '#fff', // Цвет тени для блоков (по умолчанию чёрный)
  offset = { width: 0, height: 4 }, // Смещение тени по горизонтали и вертикали (по умолчанию вниз на 4px)
  opacity = 0.3, // Прозрачность тени (по умолчанию 30%)
  radius = 5, // Радиус размытия тени (по умолчанию 5px)
  elevation = 6, // Высота "подъема" для создания тени на Android (по умолчанию 6)
} = {}) {
  return {
    shadowColor: color, // Устанавливаем цвет тени для iOS
    shadowOffset: offset, // Устанавливаем смещение тени для iOS
    shadowOpacity: opacity, // Устанавливаем прозрачность тени для iOS
    shadowRadius: radius, // Устанавливаем радиус размытия тени для iOS

    elevation, // Устанавливаем высоту тени для Android
  }
}
