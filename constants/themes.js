// export const themes = {
//   light: {
//     backgroundColor: '#e3e3e3', // Белый фон
//     textColor: '#404040', // Чёрный текст
//     secondaryTextColor: '#5c5c5c', // Второстепенный текст (тёмно-серый)
//     shadowTextColor: 'rgba(0, 0, 0, 0.75)', // Тёмная тень для текста
//     shadowBoxColor: 'rgba(0, 0, 0, 0.3)', // Тёмная тень для блоков
//     isActiveColorText: '#f59e0b',
//   },
//   dark: {
//     backgroundColor: '#1C2526', // Тёмный фон
//     textColor: '#D4D4D4', // Белый текст
//     secondaryTextColor: '#BBBBBB', // Второстепенный текст (светло-серый)
//     shadowTextColor: 'rgba(255, 255, 255, 0.5)', // Светлая тень для текста
//     shadowBoxColor: 'rgba(255, 255, 255, 0.5)', // Светлая тень для блоков
//     isActiveColorText: '#f59e0b',
//   },
// }
export const themes = {
  light: {
    backgroundColor: '#e3e3e3',
    textColor: '#404040',
    secondaryTextColor: '#5c5c5c',
    shadowTextColor: 'rgba(0,0,0,0.75)',
    shadowBoxColor: 'rgba(0,0,0,0.3)',
    isActiveColorText: '#f59e0b',
  },
  dark: {
    backgroundColor: '#1C2526',
    textColor: '#D4D4D4',
    secondaryTextColor: '#BBBBBB',
    shadowTextColor: 'rgba(255,255,255,0.5)',
    shadowBoxColor: 'rgba(255,255,255,0.5)',
    isActiveColorText: '#f59e0b',
  },
}

export const getTheme = (mode) => themes[mode] || themes.light
