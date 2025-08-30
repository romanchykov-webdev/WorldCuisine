// <SelectLangComponent
//   recipeDishArea={recipeDish?.area}
//   handleLangChange={handleLangChange}
//   langApp={langApp}
// />
//
// {/* top image button back and like */}
// <RefactorImageHeader
//   imageUri={recipeDish?.image_header}
//   onImageUpdate={handleImageUpdate}
//   Icon={PencilSquareIcon}
// />
//
// {/*    dish and description */}
// <View className="mb-10">
//   <RefactorTitle
//     title={recipeDish?.title}
//     // area={recipeDish?.area}
//     langApp={langApp}
//     updateHeaderTitle={updateHeaderTitle}
//     // updateAreaText={updateAreaText}
//     Icon={PencilSquareIcon}
//   />
// </View>
//
// {/* refactor Area */}
// <View className="mb-10">
//   <RefactorAreaComponent
//     area={recipeDish?.area}
//     langApp={langApp}
//     updateAreaText={updateAreaText}
//     Icon={PencilSquareIcon}
//   />
// </View>
//
// {/* tags */}
// <RefactorTagsComponent tags={recipeDish?.tags} updateTags={updateTags} langApp={langApp} />
//
// {/* block time person cal level */}
// <View className="mb-10">
//   <SelectCreateRecipeScreenCustom
//     setTotalRecipe={setRecipeDish}
//     recipeDish={recipeDish}
//     reafctorScrean={true}
//   />
// </View>
//
// {/*    Ingredients */}
// <View className="mb-10">
//   <RefactorIngredientsComponent
//     langApp={langApp}
//     ingredients={recipeDish?.ingredients}
//     updateIngredients={updateIngredients}
//     iconRefactor={PencilSquareIcon}
//     measurement={measurement}
//   />
// </View>
//
// {/* descritpion recipe */}
// <View className="mb-10">
//   <RefactorDescriptionRecipe
//     descriptionsRecipe={recipeDish?.instructions}
//     langApp={langApp}
//     Icon={PencilSquareIcon}
//     onUpdateDescription={onUpdateDescription}
//     recipe={recipeDish}
//   />
// </View>
//
// {/*    add recipe link video */}
// <View className="mb-10">
//   <AddLinkVideo
//     oldLinkVideo={recipeDish?.video}
//     refactorRecipescrean={true}
//     updateLinkVideo={updateLinkVideo}
//   />
//   {/* <Text>add anase social tiktok facebuok instagram telegram </Text> */}
// </View>
//
// {/*    add Update link to the author */}
// <LinkToTheCopyright
//   oldCopyring={recipeDish?.link_copyright}
//   updateCopyring={updateCopyring}
//   refactorRecipescrean={true}
// />
//
// {/*    AddPintGoogleMaps    */}
// <AddPointGoogleMaps
//   oldCoordinates={recipeDish?.map_coordinates}
//   refactorRecipescrean={true}
//   updateCoordinates={updateCoordinates}
// />
// {/* add update links social facebook instargra tiktok */}
// <View className="mb-10">
//   <AddLinkSocialComponent
//     refactorRecipescrean={true}
//     oldSocialLinks={recipeDish?.social_links}
//     updateSocialLinks={updateSocialLinks}
//   />
// </View>
//
// {/* refactor and save and remove recipe */}
// <View className="flex-1 flex-row justify-center mt-5  mb-10 gap-x-2">
//   {/* cancel */}
//   <TouchableOpacity
//     style={shadowBoxBlack()}
//     className="flex-1"
//     onPress={() => router.back()}
//   >
//     <ButtonSmallCustom
//       buttonText={true}
//       title={i18n.t('Cancel')}
//       w="100%"
//       h={60}
//       tupeButton="add"
//     />
//   </TouchableOpacity>
//
//   {/* Save */}
//   <TouchableOpacity style={shadowBoxBlack()} className="flex-1" onPress={saveRefactor}>
//     <ButtonSmallCustom
//       buttonText={true}
//       title={i18n.t('Save')}
//       w="100%"
//       h={60}
//       tupeButton="refactor"
//     />
//   </TouchableOpacity>
// </View>
// <View>
//   {/* delete recipe */}
//   <TouchableOpacity style={shadowBoxBlack()} className="flex-1" onPress={removeRecipe}>
//     <ButtonSmallCustom
//       buttonText={true}
//       title={i18n.t('Delete recipe')}
//       w="100%"
//       h={60}
//       tupeButton="remove"
//     />
//   </TouchableOpacity>
// </View>
