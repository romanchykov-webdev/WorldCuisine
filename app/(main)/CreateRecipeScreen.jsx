import React, {useEffect, useState} from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView, StyleSheet,
    Text, TouchableOpacity,
    View
} from 'react-native';
// arrow-up-on-square


import {useAuth} from "../../contexts/AuthContext";
import ButtonBack from "../../components/ButtonBack";
import InputCreateRecipeScreenCustom from "../../components/CreateRecipeScreen/InputCreateRecipeScreenCustom";
import SelectCreateRecipeScreenCustom from "../../components/CreateRecipeScreen/SelectCreateRecipeScreenCustom";
import IngredientsCreateRecipe
    from "../../components/CreateRecipeScreen/IngredientsCreateRecipe/IngredientsCreateRecipe";
import {getMeasurementCreateRecipeMyDB} from "../../service/getDataFromDB";
import RecipeListCreateRecipe from "../../components/CreateRecipeScreen/RecipeListCreateRecipe/RecipeListCreateRecipe";
import AddLinkVideo from "../../components/CreateRecipeScreen/AddLinkVideo";
import LinkToTheCopyright from "../../components/CreateRecipeScreen/LinkToTheCopyright";
import AddPintGoogleMaps from "../../components/CreateRecipeScreen/AddPintGoogleMaps";
import {shadowBoxBlack} from "../../constants/shadow";
import ButtonSmallCustom from "../../components/Buttons/ButtonSmallCustom";
import UploadHeaderImage from "../../components/CreateRecipeScreen/UploadHeaderImage";
import {hp} from "../../constants/responsiveScreen";

const CreateRecipeScreen = () => {

    const {user: userData, language} = useAuth()
    // console.log('creating recipe language', language)
    // console.log('creating recipe userData', userData.lang)


    // modal Preview
    const [isModalVisible, setIsModalVisible] = useState(false)

    const openModalPreview = () => {
        setIsModalVisible(true)
    }
    const closeModal = () => {
        setIsModalVisible(false)
    }

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
                    <UploadHeaderImage
                        styleTextDesc={styles.styleTextDesc}
                        styleInput={styles.styleInput}
                        langDev={langApp}
                        setTotalLangRecipe={setTotalLangRecipe}
                        totalLangRecipe={totalLangRecipe}
                    />


                    {/*   aria di recipe*/}
                    <View className="mb-5">
                        <Text style={styles.styleTextDesc}>Country of origin of the recipe</Text>
                        {
                            totalLangRecipe?.map((item, index) => {
                                return (
                                    <View key={index}>

                                        <InputCreateRecipeScreenCustom
                                            styleInput={styles.styleInput}
                                            title='Country of origin of the recipe'
                                            placeholderText={`Write the country of  ${item}`}
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
                        <Text
                            style={styles.styleTextDesc}
                        >
                            Description
                        </Text>
                        <SelectCreateRecipeScreenCustom/>
                    </View>

                    {/*    Ingredients*/}
                    <View className="mb-5">
                        <Text style={styles.styleTextDesc}>Ingredients</Text>
                        <Text className="text-neutral-700 text-xs mb-3">
                            Добавьте все ингредиенты и их количество для приготовления
                            рецепта.
                        </Text>

                        <View>
                            <IngredientsCreateRecipe
                                styleInput={styles.styleInput}
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

                    {/*    buttons save and preview*/}
                    <View className="gap-x-2 flex-row mb-10 flex-1 mt-5">

                        <TouchableOpacity
                            style={shadowBoxBlack()}
                            className="flex-1"
                        >
                            <ButtonSmallCustom
                                buttonText={true}
                                title={"Preview"}
                                bg={"violet"}
                                styleText={styles.buttonTextPrevSave}
                                w={"100%"}
                                h={"auto"}
                                styleWrapperButton={styles.buttonTextPrevSavePadding}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={shadowBoxBlack()}
                            className="flex-1"
                        >
                            <ButtonSmallCustom
                                buttonText={true}
                                title={"Save"}
                                bg={"green"}
                                styleText={styles.buttonTextPrevSave}
                                w={"100%"}
                                h={"auto"}
                                styleWrapperButton={styles.buttonTextPrevSavePadding}
                            />
                        </TouchableOpacity>

                    </View>

                    {/*<ModalClearCustom*/}

                    {/*/>*/}

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    buttonTextPrevSave: {
        color: "white",
        fontWeight: "bold",
        fontSize: 18,
    },
    buttonTextPrevSavePadding: {
        padding: 10
    },
    styleTextDesc: {
        fontSize: hp(2),
        fontWeight: "bold",
        marginBottom: 5,
        paddingLeft: 5,
    },
    styleInput: {
        fontSize: hp(2),
        flex: 1,
        borderWidth: 1,
        borderColor: "grey",
        padding: 20,
        borderRadius: 15,
    }
});


export default CreateRecipeScreen;