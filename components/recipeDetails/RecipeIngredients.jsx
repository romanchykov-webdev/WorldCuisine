import { Text, View } from 'react-native';
import { themes } from '../../constants/themes';
import { useAuth } from '../../contexts/AuthContext';
import { hp } from '../../constants/responsiveScreen';

function RecipeIngredients({ recIng, langDev }) {
    const { currentTheme } = useAuth();

    return (
        <View className="px-4">
            {recIng?.map((item, i) => {
                // получаем название ингредиента на текущем языке, fallback на 'en'
                const ingredientName = item.value[langDev] || item.value['en'];

                return (
                    <View
                        key={i}
                        className="flex-row gap-x-4 items-center mb-2"
                    >
                        {/* маркер */}
                        <View
                            style={{ height: 20, width: 20 }}
                            className="bg-amber-300 rounded-full"
                        />

                        {/* текст ингредиента и количество */}
                        <View className="flex-row gap-x-2">
                            <Text
                                style={{
                                    fontSize: hp(2),
                                    color: themes[currentTheme]
                                        ?.secondaryTextColor,
                                }}
                                className="font-extrabold"
                            >
                                {ingredientName} -
                            </Text>
                            <Text
                                style={{
                                    fontSize: hp(2),
                                    color: themes[currentTheme]
                                        ?.secondaryTextColor,
                                }}
                                className="font-medium text-neutral-600"
                            >
                                {item.ves} {item.mera}
                            </Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

export default RecipeIngredients;
