import React, {useEffect, useState} from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    View
} from 'react-native';
// arrow-up-on-square

// icons
import {
    ArrowUpOnSquareStackIcon,
} from "react-native-heroicons/mini";
import {useAuth} from "../../contexts/AuthContext";
import ButtonBack from "../../components/ButtonBack";
import InputCustomComponent from "../../components/CreateRecipeScreen/InputCustomComponent";
import InputCreateRecipeScreenCustom from "../../components/CreateRecipeScreen/InputCreateRecipeScreenCustom";
import SelectCreateRecipeScreenCustom from "../../components/CreateRecipeScreen/SelectCreateRecipeScreenCustom";
import IngredientsCreateRecipe
    from "../../components/CreateRecipeScreen/IngredientsCreateRecipe/IngredientsCreateRecipe";
import {getMeasurementCreateRecipeMyDB} from "../../service/getDataFromDB";
import RecipeListCreateRecipe from "../../components/CreateRecipeScreen/RecipeListCreateRecipe/RecipeListCreateRecipe";
import AddLinkVideo from "../../components/CreateRecipeScreen/AddLinkVideo";
import LinkToTheCopyright from "../../components/CreateRecipeScreen/LinkToTheCopyright";
import AddPintGoogleMaps from "../../components/CreateRecipeScreen/AddPintGoogleMaps";

const CreateRecipeScreen = () => {

    const {user: userData, language} = useAuth()
    // console.log('creating recipe language', language)
    // console.log('creating recipe userData', userData.lang)


    const langApp = userData.lang ?? language
    // console.log('CreateRecipeScreen',langApp)

    const [totalLangRecipe, setTotalLangRecipe] = useState([langApp])

    // measurement
    const [measurement, setMeasurement] = useState([])

    // useEffect(() => {
    //     console.log('CreateRecipeScreen totalLangRecipe',totalLangRecipe)
    // }, [totalLangRecipe]);
    // console.log(totalLangRecipe)

    // get all
    const fetchMeasurement = async () => {
        const res = await getMeasurementCreateRecipeMyDB()
        // console.log(res.data)
        setMeasurement(res.data[0].lang)

    }
    useEffect(() => {
        fetchMeasurement()
    }, [])


    return (
        <SafeAreaView
            // contentContainerStyle={{flex: 1}}
        >
            <KeyboardAvoidingView
                // style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={{paddingHorizontal: 20, marginBottom: 20,}}
                    showsVerticalScrollIndicator={false}
                    keyboardDismissMode={'on-drag'}
                >
                    {/*title*/}
                    <View className="  p-5">
                        <View className="absolute left-0 z-10">
                            <ButtonBack/>
                        </View>
                        <Text className="text-center mb-5">Create Recipe</Text>

                    </View>
                    {/* upload header image    */}
                    <View
                        className="border-2 border-neutral-200 mb-5 w-full h-[200] rounded-[15] justify-center items-center"
                    >
                        <Text className="mb-2">Upload yore header image</Text>
                        <ArrowUpOnSquareStackIcon size={50} color="green"/>
                    </View>

                    {/*    title recipe*/}
                    <View className="mb-5">

                        <InputCustomComponent langDev={langApp} setTotalLangRecipe={setTotalLangRecipe}
                                              totalLangRecipe={totalLangRecipe}/>
                    </View>

                    {/*   aria di recipe*/}
                    <View className="mb-5">
                        <Text>Country of origin of the recipe</Text>
                        {
                            totalLangRecipe?.map((item, index) => {
                                return (
                                    <View key={index}>

                                        <InputCreateRecipeScreenCustom
                                            title='Country of origin of the recipe'
                                            placeholderText={`Write the country of origin of the recipe ${item}`}
                                            placeholderColor="grey"
                                            totalLangRecipe={totalLangRecipe}

                                        />
                                    </View>
                                )
                            })
                        }
                    </View>

                    {/*    select */}
                    <View className="mb-5">
                        <Text className="mb-3">Description</Text>
                        <SelectCreateRecipeScreenCustom/>
                    </View>

                    {/*    Ingredients*/}
                    <View className="mb-5">
                        <Text className="mb-3">Ingredients</Text>
                        <Text className="text-neutral-700 text-xs mb-3">
                            Добавьте все ингредиенты и их количество для приготовления
                            рецепта.
                        </Text>

                        <View className="mb-2">
                            <IngredientsCreateRecipe
                                placeholderText={`Ingredient language`}
                                placeholderColor="grey"
                                langApp={userData.lang ?? language}
                                measurement={measurement}
                                totalLangRecipe={totalLangRecipe}
                            />
                        </View>

                    </View>

                    {/*    recipe description  */}
                    <View className="mb-10">
                        <RecipeListCreateRecipe
                            placeholderText={`Здесь вы можете описать рецепт на языке`}
                            placeholderColor="grey"
                            totalLangRecipe={totalLangRecipe}
                        />

                    </View>

                    {/*    add recipe link video*/}
                    <View className="mb-10">
                        <AddLinkVideo/>
                    </View>

                    {/*    add link to the author*/}
                    <LinkToTheCopyright/>

                    {/*    AddPintGoogleMaps    */}
                    <AddPintGoogleMaps/>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};


export default CreateRecipeScreen;