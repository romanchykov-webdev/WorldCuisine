import React from 'react';
import {View, Text,  ScrollView, TouchableOpacity} from 'react-native';
// import {categoryData} from '../constants/fakeData'
import {hp} from "../constants/responsiveScreen";
import {shadowBoxBlack, shadowText} from "../constants/shadow";

import {Image}from "expo-image"

import Animated, {FadeInDown, FadeInUp} from "react-native-reanimated";

const Categories = ({categories, activeCategory, setActiveCategory,handleChangeCategory}) => {

    // console.log('categories',categories)
    return (

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                // className="gap-y-4"
                contentContainerStyle={{gap: 10, marginBottom: 20,height:100}}
            >
                {
                    categories.length>0 &&  categories?.map((category, index) => {

                        let isActive = category.strCategory === activeCategory;
                        let isActiveCategory = isActive ? 'bg-amber-400' : 'bg-black/10'

                        return (
                            <Animated.View
                                entering={FadeInUp.duration(300).delay(index * 300).springify()}
                                key={index}
                            >
                                <TouchableOpacity
                                    // onPress={() => setActiveCategory(category.strCategory)}
                                    onPress={()=>handleChangeCategory(category.strCategory)}
                                    key={index}
                                    className="flex-1 items-center gap-y-1"
                                >
                                    <View
                                        style={shadowBoxBlack()}
                                        // className="rounded-full p-[6] bg-neutral-300"
                                        className={`rounded-full p-[6] ${isActiveCategory}`}
                                    >
                                        <Image
                                            // source={{uri: category.strCategoryThumb}}
                                            source={category.strCategoryThumb}
                                            style={{width: hp(6), height: hp(6),borderRadius:'100%'}}
                                            // className="rounded-full overflow-hidden"
                                            contentFit="cover"
                                            transition={1000}
                                        />
                                    </View>
                                    <Text
                                        style={[{width:70,fontSize:10},
                                            shadowText({
                                                offset: {width: 0.5, height: 0.5},
                                                radius: 0.5,
                                            })
                                        ]}
                                        className="text-neutral-900 text-center ">{category.strCategory}</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        )
                    })
                }
            </ScrollView>
    );
};


export default Categories;
