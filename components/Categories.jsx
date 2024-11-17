import React from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
// import {categoryData} from '../constants/fakeData'
import {hp} from "../constants/responsiveScreen";
import {shadowBoxBlack, shadowText} from "../constants/shadow";

import Animated, {FadeInDown, FadeInUp} from "react-native-reanimated";

const Categories = ({categories,activeCategory, setActiveCategory}) => {

    // console.log('categories',categories)
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            // className="gap-y-4"
            contentContainerStyle={{ gap: 10,marginBottom:20}}
        >
            {
                categories.map((category, index) => {

                    let isActive = category.strCategory === activeCategory;
                    let isActiveCategory = isActive ? 'bg-amber-400' : 'bg-black/10'

                    return (
                        <Animated.View
                            entering={FadeInUp.duration(300).delay(index*300).springify()}
                            key={index}
                        >
                            <TouchableOpacity
                                onPress={()=>setActiveCategory(category.strCategory)}
                                key={index}
                                className="flex-1 items-center gap-y-1"
                            >
                                <View
                                    style={shadowBoxBlack()}
                                    // className="rounded-full p-[6] bg-neutral-300"
                                    className={`rounded-full p-[6] ${isActiveCategory}`}
                                >
                                    <Image
                                        source={{uri: category.strCategoryThumb}}
                                        style={{width: hp(6), height: hp(6)}}
                                        className="rounded-full"
                                    />
                                </View>
                                <Text
                                    style={[
                                        shadowText({
                                            offset: {width: 0.5, height: 0.5},
                                            radius: 0.5,
                                        })
                                    ]}
                                    className="text-neutral-900 ">{category.strCategory}</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )
                })
            }
        </ScrollView>
    );
};


export default Categories;
