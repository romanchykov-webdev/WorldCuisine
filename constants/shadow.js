export const shadowText = {
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Цвет тени
    textShadowOffset: { width: 2, height: 2 }, // Смещение тени
    textShadowRadius: 3, // Радиус размытия тени
}

export const shadowBoxBlack = {
    // Тень для iOS
    shadowColor: '#000', // Цвет тени
    shadowOffset: { width: 0, height: 4 }, // Смещение тени
    shadowOpacity: 0.3, // Прозрачность тени
    shadowRadius: 5, // Радиус размытия

    // Тень для Android
    elevation: 6, // Высота "подъема" для создания тени
}
export const shadowBoxWhite = {
    // Тень для iOS
    shadowColor: '#fff', // Цвет тени
    shadowOffset: { width: 0, height: 4 }, // Смещение тени
    shadowOpacity: 0.3, // Прозрачность тени
    shadowRadius: 5, // Радиус размытия

    // Тень для Android
    elevation: 6, // Высота "подъема" для создания тени
}