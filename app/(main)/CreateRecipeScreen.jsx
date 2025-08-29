// import recipe preview
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
// arrow-up-on-square

import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import ButtonBack from '../../components/ButtonBack';
import ButtonSmallCustom from '../../components/Buttons/ButtonSmallCustom';
import AddCategory from '../../components/CreateRecipeScreen/AddCategory';
import AddLinkSocialComponent from '../../components/CreateRecipeScreen/AddLinkSocialComponent';
import AddLinkVideo from '../../components/CreateRecipeScreen/AddLinkVideo';
import AddPintGoogleMaps from '../../components/CreateRecipeScreen/AddPintGoogleMaps';
import IngredientsCreateRecipe from '../../components/CreateRecipeScreen/IngredientsCreateRecipe/IngredientsCreateRecipe';
import InputCreateRecipeScreenCustom from '../../components/CreateRecipeScreen/InputCreateRecipeScreenCustom';
import LinkToTheCopyright from '../../components/CreateRecipeScreen/LinkToTheCopyright';
import RecipeListCreateRecipe from '../../components/CreateRecipeScreen/RecipeListCreateRecipe/RecipeListCreateRecipe';
import SelectCreateRecipeScreenCustom from '../../components/CreateRecipeScreen/SelectCreateRecipeScreenCustom';
import TagsCustom from '../../components/CreateRecipeScreen/TagsCustom';
import TitleDescriptionComponent from '../../components/CreateRecipeScreen/TitleDescriptionComponent';
import UploadHeaderImage from '../../components/CreateRecipeScreen/UploadHeaderImage';
import LoadingComponent from '../../components/loadingComponent';
import TitleScreen from '../../components/TitleScrean';

import { validateRecipeStructure } from '../../constants/halperFunctions';
import { hp } from '../../constants/responsiveScreen';
import { shadowBoxBlack } from '../../constants/shadow';
import { themes } from '../../constants/themes';
import { useAuth } from '../../contexts/AuthContext';
import i18n from '../../lang/i18n';
import { getMeasurementCreateRecipeMyDB } from '../../service/getDataFromDB';
import { uploadRecipeToTheServer } from '../../service/uploadDataToTheDB';

function CreateRecipeScreen() {
    const {
        user: userData,
        language,
        setRequiredFields,
        previewRecipeReady,
        setPreviewRecipeReady,
        currentTheme,
    } = useAuth();

    const [totalRecipe, setTotalRecipe] = useState({
        category: null,
        category_id: null,
        image_header: null,
        area: null,
        title: null,
        rating: 0,
        likes: 0,
        comments: 0,
        recipe_metrics: null,
        ingredients: null,
        instructions: null,
        video: null,
        social_links: null,
        source_reference: null,
        tags: null,
        link_copyright: null,
        map_coordinates: null,
        published_id: userData.id,
        published_user: {
            avatar: userData?.avatar,
            user_id: userData?.id,
            user_name: userData?.user_name,
        },
        point: null,
    });

    const router = useRouter();

    // const [uploadRecipe, setUploadRecipe] = useState(false);

    const [loadingUpload, setLoadingUpload] = useState(false);

    const [loadingRecipe, setLoadingRecipe] = useState(false);

    useEffect(() => {
        // console.log("totalRecipe", JSON.stringify(totalRecipe));
    }, [totalRecipe]);

    const langApp = userData.app_lang ?? language;
    // console.log('CreateRecipeScreen',langApp)

    const [totalLangRecipe, setTotalLangRecipe] = useState([langApp]);

    // measurement
    const [measurement, setMeasurement] = useState([]);

    // get all
    const fetchMeasurement = async () => {
        const res = await getMeasurementCreateRecipeMyDB();
        // console.log(res.data);
        setMeasurement(res.data);
    };
    useEffect(() => {
        fetchMeasurement();
    }, []);

    const handlePreview = () => {
        // console.log("prevoew");
        // console.log(
        // 	"Preview totalRecipe:",
        // 	JSON.stringify(totalRecipe, null, 2)
        // );
        // console.log("totalRecipe", JSON.stringify(totalRecipe));

        // Проверка структуры перед переходом
        const validationResult = validateRecipeStructure(totalRecipe);
        if (!validationResult.isValid) {
            setRequiredFields(true);
            Alert.alert(`${i18n.t('Preview error')}`, validationResult.message);
            return;
        }

        // console.log("totalRecipe", JSON.stringify(totalRecipe, null));
        router.push({
            pathname: '/RecipeDetailsScreen', // Путь к экрану RecipeDetailsScreen
            params: {
                totalRecipe: JSON.stringify(totalRecipe), // Передаем данные как строку
                preview: 'true', // Указываем, что это предпросмотр
                langApp: language, // Язык приложения
            },
        });
    };

    // handlePublishRecipe
    const handlePublishRecipe = async () => {
        // setPreviewRecipeReady(false);
        // setUploadRecipe(true);
        // uploadr recipe
        // console.log("totalRecipe", JSON.stringify(totalRecipe));

        // after setUploadRecipe(false)
        // setTimeout(() => {
        // 	setUploadRecipe(false);
        // }, 2000);

        setLoadingUpload(true);

        const res = await uploadRecipeToTheServer(totalRecipe);
        if (res.success) {
            Alert.alert('Success', 'Recipe uploaded successfully!');
            router.back(); // Перенаправление после сохранения
            // Отключить оповещение об обязательном заполнение полей
            setRequiredFields(false);

            // прячем кнопку опубликовать
            setPreviewRecipeReady(false);

            setLoadingUpload(false);
        } else {
            Alert.alert('Error', res.msg);
        }
    };

    return (
        <>
            {loadingRecipe ? (
                <LoadingComponent color="green" />
            ) : (
                <SafeAreaView
                    style={{
                        backgroundColor: themes[currentTheme]?.backgroundColor,
                    }}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
                        <ScrollView
                            contentContainerStyle={{
                                paddingHorizontal: 20,
                                marginBottom: 20,
                                marginTop: Platform.OS === 'ios' ? null : 60,
                            }}
                            showsVerticalScrollIndicator={false}
                            keyboardDismissMode="on-drag"
                        >
                            {/* title */}
                            <View className="pt-5">
                                <View className=" flex-1">
                                    <ButtonBack />
                                </View>
                                <View className="items-center mb-5">
                                    <TitleScreen
                                        title={i18n.t('Create Recipe')}
                                    />
                                </View>
                            </View>

                            {/* add category */}
                            <AddCategory
                                langApp={langApp}
                                setTotalRecipe={setTotalRecipe}
                            />
                            {/* upload header image    */}
                            <UploadHeaderImage
                                styleTextDesc={styles.styleTextDesc}
                                styleInput={styles.styleInput}
                                langDev={langApp}
                                setTotalLangRecipe={setTotalLangRecipe}
                                totalLangRecipe={totalLangRecipe}
                                setTotalRecipe={setTotalRecipe}
                                totalRecipe={totalRecipe}
                                currentTheme={currentTheme}
                                themes={themes}
                            />
                            {/*   aria di recipe */}
                            <View className="mb-5">
                                <TitleDescriptionComponent
                                    titleText={i18n.t(
                                        'Country of origin of the recipe'
                                    )}
                                    titleVisual={true}
                                />
                                <InputCreateRecipeScreenCustom
                                    styleInput={styles.styleInput}
                                    placeholderText={i18n.t(
                                        'Write the name of the country'
                                    )}
                                    placeholderColor="grey"
                                    totalLangRecipe={totalLangRecipe}
                                    setTotalRecipe={setTotalRecipe}
                                />
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    buttonTextPrevSave: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    buttonTextPrevSavePadding: {
        padding: 10,
    },
    styleTextDesc: {
        fontSize: hp(2),
        fontWeight: 'bold',
        marginBottom: 5,
        paddingLeft: 5,
    },
    styleInput: {
        fontSize: hp(2),
        flex: 1,
        borderWidth: 1,
        borderColor: 'grey',
        padding: 20,
        borderRadius: 15,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    cancelText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default CreateRecipeScreen;
