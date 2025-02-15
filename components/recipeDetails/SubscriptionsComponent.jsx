import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ButtonSmallCustom from "../Buttons/ButtonSmallCustom";
import {PlusIcon, UsersIcon, DocumentTextIcon} from "react-native-heroicons/mini"
import AvatarCustom from "../AvatarCustom";
import {shadowBoxBlack} from "../../constants/shadow";
import {hp} from "../../constants/responsiveScreen";
import {myFormatNumber} from "../../constants/halperFunctions";
import {useRouter} from "expo-router";

const SubscriptionsComponent = ({subscriberId,creatorId}) => {

    const router = useRouter();
    // subscriberId={user?.id} creatorId={recipeDish?.publishedId}
    // console.log("subscriberId",subscriberId);
    console.log("creatorId",creatorId);
    const handleSubscribe = async () => {
        console.log("ok")
        console.log("subscriberId",subscriberId)
        console.log("creatorId",creatorId)
    };
    return (
            <View className="flex-row items-center justify-between gap-x-3 mb-5 ">

                {/*block avatar subscribe recipe*/}
                <View className=" flex-1 m-w-[50%] flex-row items-center justify-start gap-x-3 ">
                   <View style={shadowBoxBlack()}
                         className="items-center relative"
                   >
                       <TouchableOpacity
                       onPress={()=>router.push({
                           pathname: "(main)/AllRecipesBayCreator",
                           query: { creatorId: creatorId }, // Передача ID пользователя
                       })}
                       >
                           <AvatarCustom
                               size={hp(10)}
                           />
                       </TouchableOpacity>

                       {/*<Text*/}
                       {/*    numberOfLines={1}*/}
                       {/*    style={{maxWidth:hp(10),overflow:"hidden",fontSize:12}}*/}
                       {/*    className="absolute bottom-[-18]"*/}

                       {/*>*/}
                       {/*    userName*/}
                       {/*</Text>*/}
                   </View>

                    <View className="w-full  overflow-hidden flex-1">
                        <View className="flex-row items-center">
                            {/*<DocumentTextIcon color="grey"/>*/}
                            {/*<Text className="text-xs font-bold" numberOfLines={1}> - {myFormatNumber(1)}</Text>*/}
                            <Text
                                numberOfLines={1}
                                style={{fontSize:14}}
                                className="font-bold"

                            >
                                userName впквпвпвпвпвп
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <UsersIcon color="grey"/>
                            <Text className="text-xs font-bold" numberOfLines={1}> - {myFormatNumber(10205)}</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleSubscribe}
                    className="flex-1 m-w-[50%] "
                    style={shadowBoxBlack()}
                >
                    <ButtonSmallCustom
                    title="Subscribe"
                    bg={"green"}
                    // icon={PlusIcon}
                    w="100%"
                    h={60}
                    buttonText={true}
                    />
                </TouchableOpacity>
            </View>
    );
};

const styles = StyleSheet.create({});

export default SubscriptionsComponent;