// import {KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View} from "react-native";
// import ButtonBack from "../components/ButtonBack";
// import TitleScrean from "../components/TitleScrean";
// import i18n from "../lang/i18n";
// import AddCategory from "../components/CreateRecipeScreen/AddCategory";
// import UploadHeaderImage from "../components/CreateRecipeScreen/UploadHeaderImage";
// import {themes} from "../constants/themes";
// import TitleDescriptionComponent from "../components/CreateRecipeScreen/TitleDescriptionComponent";
// import InputCreateRecipeScreenCustom from "../components/CreateRecipeScreen/InputCreateRecipeScreenCustom";
// import TagsCustom from "../components/CreateRecipeScreen/TagsCustom";
// import SelectCreateRecipeScreenCustom from "../components/CreateRecipeScreen/SelectCreateRecipeScreenCustom";
// import IngredientsCreateRecipe from "../components/CreateRecipeScreen/IngredientsCreateRecipe/IngredientsCreateRecipe";
// import RecipeListCreateRecipe from "../components/CreateRecipeScreen/RecipeListCreateRecipe/RecipeListCreateRecipe";
// import AddLinkVideo from "../components/CreateRecipeScreen/AddLinkVideo";
// import AddLinkSocialComponent from "../components/CreateRecipeScreen/AddLinkSocialComponent";
// import LinkToTheCopyright from "../components/CreateRecipeScreen/LinkToTheCopyright";
// import AddPintGoogleMaps from "../components/CreateRecipeScreen/AddPintGoogleMaps";
// import {shadowBoxBlack} from "../constants/shadow";
// import ButtonSmallCustom from "../components/Buttons/ButtonSmallCustom";
// import LoadingComponent from "../components/loadingComponent";
//
// <KeyboardAvoidingView
//     // style={{flex: 1}}
//     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// >
//     <ScrollView
//         contentContainerStyle={{
//             paddingHorizontal: 20,
//             marginBottom: 20,
//             marginTop: Platform.OS === 'ios' ? null : 60,
//         }}
//         showsVerticalScrollIndicator={false}
//         keyboardDismissMode="on-drag"
//     >
//         {/* title */}
//         <View className="pt-5">
//             <View className=" flex-1">
//                 <ButtonBack />
//             </View>
//             {/* <Text className="text-center mb-5 text-xl font-bold">Create Recipe</Text> */}
//             <View className="items-center mb-5">
//                 <TitleScrean title={i18n.t('Create Recipe')} />
//             </View>
//         </View>
//
//         {/* add category */}
//         <AddCategory langApp={langApp} setTotalRecipe={setTotalRecipe} />
//
//         {/* upload header image    */}
//         <UploadHeaderImage
//             styleTextDesc={styles.styleTextDesc}
//             styleInput={styles.styleInput}
//             langDev={langApp}
//             setTotalLangRecipe={setTotalLangRecipe}
//             totalLangRecipe={totalLangRecipe}
//             setTotalRecipe={setTotalRecipe}
//             totalRecipe={totalRecipe}
//             currentTheme={currentTheme}
//             themes={themes}
//         />
//
//         {/*   aria di recipe */}
//         <View className="mb-5">
//             {/* <Text style={styles.styleTextDesc}>Country of origin of the recipe</Text> */}
//             <TitleDescriptionComponent
//                 titleText={i18n.t('Country of origin of the recipe')}
//                 titleVisual={true}
//
//             />
//
//             <InputCreateRecipeScreenCustom
//                 styleInput={styles.styleInput}
//                 placeholderText={i18n.t('Write the name of the country')}
//                 placeholderColor="grey"
//                 totalLangRecipe={totalLangRecipe}
//                 setTotalRecipe={setTotalRecipe}
//             />
//         </View>
//
//         {/*  Tags   */}
//         <TagsCustom
//             styleInput={styles.styleInput}
//             styleTextDesc={styles.styleTextDesc}
//             setTotalRecipe={setTotalRecipe}
//         />
//
//         {/*    select */}
//         <View className="mb-5">
//             <SelectCreateRecipeScreenCustom setTotalRecipe={setTotalRecipe} />
//         </View>
//
//         {/*    Ingredients */}
//         <View className="mb-5">
//             {/* <Text style={styles.styleTextDesc}>Ingredients</Text> */}
//             {/* <Text className="text-neutral-700 text-xs mb-3">Добавьте все ингредиенты и их количество для приготовления рецепта.</Text> */}
//
//             <View>
//                 <IngredientsCreateRecipe
//                     styleInput={styles.styleInput}
//                     placeholderText={i18n.t('Name of the ingredient')}
//                     placeholderColor="grey"
//                     langApp={userData.lang ?? language}
//                     measurement={measurement}
//                     totalLangRecipe={totalLangRecipe}
//                     setTotalRecipe={setTotalRecipe}
//                 />
//             </View>
//         </View>
//
//         {/*    recipe description  */}
//         <View className="mb-10">
//             <RecipeListCreateRecipe
//                 placeholderText={i18n.t('Here you can describe the recipe in the language')}
//                 placeholderColor="grey"
//                 totalLangRecipe={totalLangRecipe}
//                 setTotalRecipe={setTotalRecipe}
//             />
//         </View>
//
//         {/*    add recipe link video */}
//         <View className="mb-10">
//             <AddLinkVideo setTotalRecipe={setTotalRecipe} />
//             {/* <Text>add anase social tiktok facebuok instagram telegram </Text> */}
//         </View>
//
//         {/* add links social facebook instargra tiktok */}
//         <View className="mb-10">
//             <AddLinkSocialComponent setTotalRecipe={setTotalRecipe} />
//         </View>
//
//         {/*    add link to the author */}
//         <LinkToTheCopyright setTotalRecipe={setTotalRecipe} />
//
//         {/*    AddPintGoogleMaps    */}
//         <AddPintGoogleMaps setTotalRecipe={setTotalRecipe} />
//
//         {/*    buttons save and preview */}
//         <View className="gap-y-5 mt-10 mb-10 flex-1 ">
//             <TouchableOpacity onPress={handlePreview} style={shadowBoxBlack()} className="flex-1">
//                 <ButtonSmallCustom
//                     buttonText={true}
//                     title={i18n.t('Preview')}
//                     bg="violet"
//                     // styleText={styles.buttonTextPrevSave}
//                     w="100%"
//                     h={60}
//                     // styleWrapperButton={styles.buttonTextPrevSavePadding}
//                 />
//             </TouchableOpacity>
//
//             {previewRecipeReady && (
//                 <TouchableOpacity
//                     onPress={handlePublishRecipe}
//                     style={[{ backgroundColor: 'green' }, shadowBoxBlack()]}
//                     className="flex-1 w-full h-[100] rounded-[12] border-[1px] border-neutral-50 "
//                 >
//                     {loadingUpload
//                         ? (
//                             <LoadingComponent />
//                         )
//                         : (
//                             <ButtonSmallCustom
//                                 buttonText={true}
//                                 title={i18n.t('Publish')}
//                                 bg="green"
//                                 w="100%"
//                                 h={100}
//                             />
//                         )}
//                 </TouchableOpacity>
//             )}
//         </View>
//     </ScrollView>
// </KeyboardAvoidingView>
