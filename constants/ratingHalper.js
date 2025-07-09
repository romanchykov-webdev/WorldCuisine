export function calculateRating(ratings) {
  if (!ratings || ratings.length === 0)
    return 0 // Проверка на пустой массив
  const total = ratings.reduce((sum, rating) => sum + rating, 0) // Суммируем все оценки
  return (total / ratings.length).toFixed(1) // Вычисляем среднее и округляем до 1 знака
}
