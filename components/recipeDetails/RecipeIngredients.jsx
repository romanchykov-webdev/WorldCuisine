import React from 'react';
import { View, Text } from 'react-native';

const RecipeIngredients = ({ recIng, langDev }) => {

    // Получаем ингредиенты для текущего языка или используем английский (fallback)
    // const ingredients = recIng[langDev] || recIng['en'];

    // Определяем язык: текущий или первый доступный
    const language = recIng[langDev] ? langDev : Object.keys(recIng)[0];

    // Получаем ингредиенты для выбранного языка
    const ingredients = recIng[language];

    return (
        <View>
            {ingredients.map((item, i) => (
                <View key={i} className="flex-row gap-x-4 items-center mb-2">
                    <View style={{ height: 20, width: 20 }} className="bg-amber-300 rounded-full" />
                    <View className="flex-row gap-x-2">
                        <Text style={{ fontSize: 16 }} className="font-extrabold text-neutral-700">
                            {item.ingredient} -
                        </Text>
                        <Text style={{ fontSize: 16 }} className="font-medium text-neutral-600">
                            {item.quantity} {item.unit}
                        </Text>
                    </View>
                </View>
            ))}
        </View>
    );
};

export default RecipeIngredients;
