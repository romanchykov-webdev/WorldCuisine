import React, {useEffect, useState} from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
// arrow-up-on-square

// icons
import {
    ArrowUpOnSquareStackIcon,
    ArrowUpOnSquareIcon,
} from "react-native-heroicons/mini";
import {shadowBoxBlack} from "../../constants/shadow";
import {useAuth} from "../../contexts/AuthContext";
import ButtonBack from "../../components/ButtonBack";
import AddLangComponent from "../../components/CreateRecipeScreen/AddLangComponent";
import InputCustomComponent from "../../components/CreateRecipeScreen/InputCustomComponent";
import InputCreateRecipeScreenCustom from "../../components/CreateRecipeScreen/InputCreateRecipeScreenCustom";
import SelectCreateRecipeScreenCustom from "../../components/CreateRecipeScreen/SelectCreateRecipeScreenCustom";
import IngredientsCreateRecipe from "../../components/CreateRecipeScreen/IngredientsCreateRecipe";

const CreateRecipeScreen = () => {

    const {user: userData, language} = useAuth()
    // console.log('creating recipe language', language)

    const langApp = userData.lang ?? language
    // console.log('CreateRecipeScreen',langApp)

    const [totalLangRecipe, setTotalLangRecipe] = useState([langApp])

    // useEffect(() => {
    //     console.log('CreateRecipeScreen totalLangRecipe',totalLangRecipe)
    // }, [totalLangRecipe]);
    // console.log(totalLangRecipe)


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
                    <View>
                        <Text className="mb-3">Ingredients</Text>
                        <IngredientsCreateRecipe/>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({});

export default CreateRecipeScreen;