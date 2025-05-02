import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Cog6ToothIcon } from "react-native-heroicons/mini";
import { default as Icon, default as IconComent } from "react-native-vector-icons/EvilIcons";
import { hp } from "../constants/responsiveScreen";
import { shadowBoxBlack } from "../constants/shadow";
import AvatarCustom from "./AvatarCustom";

// for translate
import i18n from "../lang/i18n";
import {themes} from "../constants/themes";
import {useAuth} from "../contexts/AuthContext";

const HeaderComponent = ({ isAuth, user, unreadCommentsCount, unreadLikesCount }) => {

	const{currentTheme}=useAuth()
	const router = useRouter();

	// console.log('HeaderComponent user',user)
	// console.log('user HeaderComponent',user)

	// console.log('home component isAuth',isAuth)

	return (
		<View>
			<View className="flex-row  justify-between items-center mb-5">
				<View className="flex-row items-center">
					<Image
						source={require("../assets/img/ratatouille.png")}
						className="w-[25] h-[25] rounded-full mr-1"
						resizeMode="cover"
					/>
					<Text  style={{ fontSize: 24,color:themes[currentTheme]?.textColor }}>
						Ratatouille
					</Text>
				</View>
				<View>
					{isAuth ? (
						<TouchableOpacity
							style={shadowBoxBlack({
								offset: { width: 2, height: 2 }, // Смещение тени по горизонтали и вертикали (по умолчанию вниз на 4px)
								opacity: 0.3, // Прозрачность тени (по умолчанию 30%)
								radius: 5,
							})}
							onPress={() => router.push("/ProfileScreen")}
						>
							<View className=" relative">
								<AvatarCustom
									uri={user?.avatar}
									size={hp(4.3)}
									style={{ borderWidth: 0.2 }}
									rounded={50}
								/>
								<View className="  absolute left-[-10] gap-y-5 top-[-5px]">
									{unreadCommentsCount > 0 && <IconComent name="comment" size={20} color="red" />}
									{unreadLikesCount > 0 && <Icon name="heart" size={20} color="red" />}
									{/* <Icon name="heart" size={20} color="red" /> */}
								</View>
							</View>
						</TouchableOpacity>
					) : (
						<View className="flex-row">
							{/*    sign to settings*/}
							<TouchableOpacity onPress={() => router.push("/ProfileScreen")} className="p-2">
								<Cog6ToothIcon size={hp(3)} color="gray" />
							</TouchableOpacity>
						</View>
					)}
				</View>

				{/*<TouchableOpacity>*/}
				{/*    <Cog6ToothIcon size={hp(4)} color="gray"/>*/}
				{/*</TouchableOpacity>*/}
			</View>
			{isAuth && (
				<View className="flex-row">
					<Text style={{ fontSize: hp(1.7),color:themes[currentTheme]?.textColor }}>
						{i18n.t("Hello")},{" "}
					</Text>
					<Text style={{ fontSize: hp(1.7),color:themes[currentTheme]?.textColor }} className=" capitalize">
						{user?.user_name} !
					</Text>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({});

export default HeaderComponent;
