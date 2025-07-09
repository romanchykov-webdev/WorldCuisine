import axios from 'axios'

export async function getCategories() {
  try {
    const response = await axios.get('https://themealdb.com/api/json/v1/1/categories.php')

    if (response && response.data) {
      return response.data
    }
  }
  catch (err) {
    console.log('Error getCategories', err.message)
  }
}
export async function getRecipes(category) {
  // console.log('getRecipes', category)
  try {
    const response = await axios.get(`https://themealdb.com/api/json/v1/1/filter.php?c=${category}`)

    // console.log('response',response.data)
    if (response && response.data) {
      return response.data.meals
    }
  }
  catch (err) {
    console.log('Error getCategories', err.message)
  }
}

// get recipe dish
export async function getRecipeDish(dishId) {
  try {
    const response = await axios.get(`https://themealdb.com/api/json/v1/1/lookup.php?i=${dishId}`)

    // console.log('response',response.data)
    if (response && response.data) {
      return response.data.meals[0]
    }
  }
  catch (err) {
    console.log('Error getCategories', err.message)
  }
}
