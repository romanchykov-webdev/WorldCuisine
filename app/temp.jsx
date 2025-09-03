//
// function FavoriteScreen() {
//   const user = useAuthStore((s) => s.user)
//   const lang = useLangStore((s) => s.lang)
//   const [showFolders, setShowFolders] = useState(false)
//
//   // 1) IDs
//   const { data: ids = [], isLoading: l1, isError: e1 } = useFavoriteIds(user?.id)
//
//   // 2) Сами рецепты
//   // const { data: recipes = [], isLoading: l2, isError: e2 } = useFavoriteRecipes(ids)
//   const { data: recipes = [], isLoading: l2, isFetching: f2, isError: e2 } = useFavoriteRecipes(ids)
//   const loading = l1 || f2 || (showFolders && l3)
//   console.log('FavoriteScreen,recipes', recipes)
//
//   // 3) Категории, отфильтрованные по избранному
//   const { data: categories = [], isLoading: l3, isError: e3 } = useFavoriteCategories(lang, recipes)
//
//   //
//   console.log('FAV ids:', ids?.length, ids)
//   console.log('FAV recipes:', recipes?.length)
//   console.log('FAV cats:', categories?.length)
//
//   // const loading = l1 || l2 || (showFolders && l3)
//   const hasError = e1 || e2 || (showFolders && e3)
//   const hasRecipes = (recipes || []).length > 0
//
//   return (
//     <WrapperComponent>
//       <View style={{ flex: 1 }}>
//         <View className="mb-5">
//           <HeaderScreenComponent titleScreanText={i18n.t('Liked')} />
//           <ToggleListCategoryComponent
//             toggleFolderList={showFolders}
//             onToggleChange={setShowFolders}
//             hasRecipes={hasRecipes}
//           />
//         </View>
//
//         {loading ? (
//           <LoadingComponent color="green" />
//         ) : hasError ? (
//           <View style={{ paddingVertical: 16 }}>
//             <Text style={{ textAlign: 'center', opacity: 0.6 }}>Something went wrong</Text>
//           </View>
//         ) : !hasRecipes ? (
//           <View style={{ paddingVertical: 16 }}>
//             <Text style={{ textAlign: 'center', opacity: 0.6 }}>
//               There are no recipes you like yet
//             </Text>
//           </View>
//         ) : showFolders ? (
//           // Папки (категории masonry, уже отфильтрованные по избранному)
//           <RecipesMasonryComponent categoryRecipes={categories} langApp={lang} />
//         ) : (
//           // Список рецептов
//           <AllRecipesPointScreen
//             allFavoriteRecipes={recipes}
//             isFavoriteScrean
//             isScreanAlrecipeBayCreatore={false}
//             titleVisible={false}
//           />
//         )}
//       </View>
//     </WrapperComponent>
//   )
// }
//
// export default FavoriteScreen
