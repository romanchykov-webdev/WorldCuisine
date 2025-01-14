import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useLocalSearchParams, useRouter} from "expo-router";
import {getAllRecipesPointMasonryMyDB} from "../../service/getDataFromDB";
import {hp} from "../../constants/responsiveScreen";
import {shadowBoxBlack, shadowText} from "../../constants/shadow";
import i18n from "../../lang/i18n";
import LoadingComponent from "../../components/loadingComponent";
import MasonryList from "@react-native-seoul/masonry-list";
import Animated, {FadeInDown, FadeInLeft, FadeInUp} from "react-native-reanimated";
import {ChatBubbleOvalLeftEllipsisIcon, HeartIcon, PlayCircleIcon, StarIcon} from "react-native-heroicons/outline";
import AvatarCustom from "../../components/AvatarCustom";
import {LinearGradient} from "expo-linear-gradient";
import {myFormatNumber} from "../../constants/halperFunctions";
import {getDeviceType} from "../../constants/getWidthDevice";
import ButtonBack from "../../components/ButtonBack";

const AllRecipesPointScreen = () => {

    const {point,langApp} = useLocalSearchParams();

    // console.log('AllRecipesPointScreen langApp',langApp)



    const [column, setColumn] = useState(0)
    useEffect(() => {
        // Определяем тип устройства и обновляем количество колонок
        const type = getDeviceType(window.innerWidth);
        setColumn(type);

    }, [])

    const [allRecipes, setAllRecipes] = useState([])

    console.log('AllRecipesPointScreen',point)

    const fetchGetAllRecipesPointMasonryMyDB=async ()=>{
        const res =  await getAllRecipesPointMasonryMyDB(point)
        // console.log('AllRecipesPointScreen res point', JSON.stringify(res.data,null,2))
        setAllRecipes(res.data)
    }

    useEffect(() => {
        fetchGetAllRecipesPointMasonryMyDB()
    }, [point]);

    return (
        <SafeAreaView>
            <ScrollView>
                <View className="gap-y-3 p-[20]">

                   {/* block header*/}
                   <View className=" items-center justify-center mb-5">
                      <Animated.View
                          entering={FadeInLeft.delay(300).springify().damping(30)}
                          className="absolute left-0">
                          <ButtonBack/>
                      </Animated.View>
                       <Animated.Text
                           entering={FadeInUp.delay(500).springify().damping(30)}
                           style={[{fontSize: hp(3)},
                               shadowText(
                                   {
                                       color: 'rgba(0,0,0,0.4)',
                                       offset: {width: 1.5, height: 1.5},
                                       radius: 1,
                                   }
                               )
                           ]}
                           className="font-semibold text-neutral-700 mb-2"
                       >
                           {i18n.t('Recipes')}
                       </Animated.Text>
                   </View>
                    {/* block header end*/}

                    {/*    masonry*/}
                    {
                        // categories === 0 ? null : (
                        // categories.lenght === 0 ||
                        allRecipes?.length == 0
                            ? (
                                <LoadingComponent size="large" color="gray"/>
                            )
                            : (
                                <MasonryList
                                    // data={mealData}
                                    data={allRecipes}
                                    keyExtractor={(item) => item.id}
                                    // numColumns={2}
                                    numColumns={column}
                                    style={{gap: 10}}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({item, i}) => <RecipePointItem item={item} index={i} langApp={langApp} />}
                                    // refreshing={isLoadingNext}
                                    // onRefresh={() => refetch({first: ITEM_CNT})}
                                    onEndReachedThreshold={0.1}
                                    // onEndReached={() => loadNext(ITEM_CNT)}
                                />
                            )
                    }

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const RecipePointItem = ({item, index,langApp}) => {
    // console.log('index', index)
    // console.log('CardItem item', item)
    // console.log('CardItem langApp', langApp)
    const router = useRouter()


    const isEven = index % 3 === 0;
    const imageHeight = isEven ? hp(25) : hp(35);

    // Находим название категории в зависимости от выбранного языка

    const categoryTitle = Array.isArray(item.title.lang)
        ? item.title.lang.find(it => it.lang === langApp)?.name || item.title.strTitle
        : item.title.strTitle;

    // console.log('categoryTitle',categoryTitle)


    return (
        <Animated.View
            entering={FadeInDown.delay((index + 4) * 200).springify().damping(30)}
            // key={index}
            key={item.id}
            className="flex justify-center mb-[10] gap-y-1  p-[2]"
            style={[shadowBoxBlack({offset: {width: 1, height: 1}, opacity: 1, radius: 3})]}
        >
            <TouchableOpacity
                onPress={() => router.push({
                    pathname: 'RecipeDetailsScreen',
                    params: {id: item.fullRecipeId,langApp:langApp},
                })}
                style={{width: '100%'}}
                className="rounded-full relative items-center "
            >

                {/*block up video user*/}
                <View
                    style={shadowBoxBlack({
                        offset: {width: 1, height: 1}, // Смещение тени по горизонтали и вертикали (по умолчанию вниз на 4px)
                        opacity: 1, // Прозрачность тени (по умолчанию 30%)
                        radius: 1, // Радиус размытия тени (по умолчанию 5px)
                        elevation: 3, // Высота "подъема" для создания тени на Android (по умолчанию 6)
                    })}
                    className={`${item.video ? 'justify-between' : 'justify-end'} items-start flex-row w-full absolute top-2 left-0 z-10 px-5 
                    `}>
                    {
                        item.video && <PlayCircleIcon size={25} color='red'/>
                    }

                    <View className=" items-center ">
                        <AvatarCustom
                            uri={item.publishedUser.avatar}
                            size={25}
                            style={{borderWidth: 0.2}}
                            rounded={50}
                        />
                        <Text
                            style={{fontSize: 6, maxWidth: 20, overflow: 'hidden',textAlign:'center'}}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {item.publishedUser.username}
                        </Text>

                    </View>

                </View>

                <AvatarCustom
                    uri={item.imageHeader}
                    style={{borderWidth: 0.2, width: '100%', height: imageHeight}}
                    rounded={35}
                />
                <LinearGradient

                    colors={['transparent', '#18181b']}
                    style={{width: '100%', height: '100%', position: 'absolute', borderRadius: 35}}
                    start={{x: 0.5, y: 0.2}}
                    end={{x: 0.5, y: 1}}
                />


                {/*    icons like comments rating*/}
                <View className=" absolute bottom-[20] items-center justify-around">
                    <Text className=" text-white font-medium text-center mb-2"
                          style={shadowText()}
                    >
                        {categoryTitle}
                    </Text>

                    {/*icons*/}
                    <View className="flex-row items-center justify-around  w-full min-h-[25px]
                    {/*bg-red-500*/}
                    ">
                        {/*    like*/}
                        {
                            item.likes > 0 && (
                                <View className="items-center ">
                                    <HeartIcon size={25} color='gray'/>
                                    {/*<HeartIcon size={30} color='gray' fill='red'/>*/}
                                    <Text style={{fontSize: 8,maxWidth: 25, overflow: 'hidden',textAlign:'center'}}
                                          className="text-white"
                                          numberOfLines={1}
                                          ellipsizeMode="tail"

                                    >
                                        {myFormatNumber(item.likes)}
                                        {/*{item.likes}234*/}
                                    </Text>
                                </View>
                            )
                        }


                        {/*    comments*/}
                        {
                            item.comments > 0 && (
                                <View className="items-center ">
                                    <ChatBubbleOvalLeftEllipsisIcon size={25} color='gray'/>
                                    <Text style={{fontSize: 8,maxWidth: 25, overflow: 'hidden',textAlign:'center'}}
                                          className="text-white"
                                          numberOfLines={1}
                                          ellipsizeMode="tail">
                                        {myFormatNumber(item.comments)}
                                        {/*{item.comments}*/}
                                    </Text>
                                </View>
                            )
                        }


                        {/*    StarIcon*/}
                        {
                            item.rating > 0 && (
                                <View className="items-center">
                                    <StarIcon size={25} color='gray'/>
                                    <Text style={{fontSize: 8}} className="text-white">
                                        {item.rating}
                                    </Text>
                                </View>
                            )
                        }

                    </View>


                </View>
            </TouchableOpacity>
        </Animated.View>
    )
}

const styles = StyleSheet.create({});

export default AllRecipesPointScreen;