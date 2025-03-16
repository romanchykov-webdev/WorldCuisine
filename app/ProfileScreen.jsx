import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ButtonBack from "../components/ButtonBack";

import { wp } from "../constants/responsiveScreen";
import { shadowBoxBlack } from "../constants/shadow";

import { ArrowLeftEndOnRectangleIcon, CreditCardIcon, HeartIcon, PencilSquareIcon } from "react-native-heroicons/mini";
import { useAuth } from "../contexts/AuthContext";

import AvatarCustom from "../components/AvatarCustom";
import { logOut } from "../service/userService";

// translate
import RecipeLikedItem from "../components/profile/RecipeLikedItem";
import TitleScrean from "../components/TitleScrean";
import i18n from "../lang/i18n";

const ProfileScreen = () => {
	const { setAuth, user } = useAuth();

	// change lang
	// const [lang, setLang] = useState('en'); // Устанавливаем язык

	const [dataInProf, setDataInProf] = useState(null);

	// console.log('Profile user',user)

	const [isAuth, setIsAuth] = useState(null);
	useEffect(() => {
		if (user) {
			setIsAuth(true);
		} else {
			setIsAuth(false);
		}
	}, [user]);

	// console.log('setAuth ProfileScreen',setAuth)
	// console.log('identities ProfileScreen',user.identities)

	// console.log('ProfileScreen userData:',userData)

	const router = useRouter();

	// change avatar
	const updateProfile = async () => {
		// console.log('updateProfile')
		router.push("/(main)/editProfile");
	};

	// // log out
	// const logOut = async () => {
	//     setAuth(null)
	//
	//     const {error} = await supabase.auth.signOut();
	//     if (error) {
	//         Alert.alert('Sign Out', "Error signing out!");
	//     }
	//     router.replace('/homeScreen')
	// }
	const handleLogUot = async () => {
		// console.log('log out')

		Alert.alert("Confirm", "Are you sure you want to log out?", [
			{
				text: "Cancel",
				onPress: () => console.log("modal cancelled"),
				style: "cancel",
			},
			{
				text: "LogOut",
				onPress: () => logOut({ setAuth, router }),
				style: "destructive",
			},
		]);
	};

	// rename userName

	// console.log('newUserName Input',newUserName)

	const handleMyRecipes = () => {
		console.log("handleMyPost");
		router.push({
			pathname: "(main)/AllRecipesBayCreator", // Путь к экрану AllRecipesBayCreator
			params: {
				creator_id: user?.id, // Передаем данные как строку
			},
		});
	};

	// handleMyFavorite
	const handleMyLiked = () => {
		// console.log("handleMyFavorite user.id", user?.id);

		// const res = await getAllMyLikedRecipes(user.id);
		// setDataInProf(res.data);
		// console.log('ProfileScreen handleMyLiked',res.data)
		router.push("(main)/FavoriteScrean");
	};

	return (
		<>
			{isAuth ? (
				<>
					<SafeAreaView
						contentContainerStyle={{ flex: 1 }}
						// className="bg-red-500"
					>
						<ScrollView
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{ paddingHorizontal: 20, marginTop: 60 }}
						>
							<View className="flex-row justify-between items-center">
								<View style={shadowBoxBlack()}>
									<ButtonBack />
								</View>

								<TitleScrean title={i18n.t("Profile")} />

								<TouchableOpacity
									onPress={handleLogUot}
									style={shadowBoxBlack()}
									className="bg-white p-3 border-[1px] border-neutral-300 rounded-full"
								>
									<ArrowLeftEndOnRectangleIcon size={30} color="red" />
								</TouchableOpacity>
							</View>

							{/*    avatar and user name*/}
							<View className=" gap-y-5 items-center mb-5 ">
								{/*avatar*/}
								<View className="relative ">
									<View style={shadowBoxBlack()}>
										<AvatarCustom
											uri={user?.avatar}
											size={wp(50)}
											style={{ borderWidth: 0.2 }}
											rounded={150}
										/>
									</View>
									<View className="absolute bottom-5 right-5" style={shadowBoxBlack()}>
										<TouchableOpacity
											onPress={updateProfile}
											className="bg-white p-2 border-[1px] border-neutral-300 rounded-full"
										>
											<PencilSquareIcon size={30} color="grey" />
										</TouchableOpacity>
									</View>
								</View>

								{/*userName*/}
								<Text>{user?.user_name}</Text>
							</View>

							{/*change lang app*/}
							{/*   update profile   may posts may like  may rating*/}
							<View className="flex-row mb-5 items-center justify-around">
								{/*may recipe*/}
								<TouchableOpacity
									onPress={handleMyRecipes}
									style={shadowBoxBlack()}
									className="items-center p-2 bg-neutral-200 rounded-[15] w-[80] h-[80] justify-around"
								>
									<CreditCardIcon size={45} color="green" />
									<Text numberOfLines={1} style={{ fontSize: 8 }}>
										{i18n.t("My recipes")}
									</Text>
								</TouchableOpacity>

								{/*may favorite*/}
								<TouchableOpacity
									onPress={() => router.push("(main)/CreateRecipeScreen")}
									style={shadowBoxBlack()}
									className="items-center p-2 bg-neutral-200 rounded-[15] w-[80] h-[80] justify-around"
								>
									{/*<BellIcon size={45} color='gold'/>*/}
									<PencilSquareIcon size={45} color="gold" />
									<Text numberOfLines={1} style={{ fontSize: 8 }}>
										{i18n.t("Create recipe")}
									</Text>
								</TouchableOpacity>

								{/*may Favorite*/}
								<TouchableOpacity
									onPress={handleMyLiked}
									style={shadowBoxBlack()}
									className="items-center p-2 bg-neutral-200 rounded-[15] w-[80] h-[80] justify-around"
								>
									<HeartIcon size={45} color="red" />
									<Text numberOfLines={1} style={{ fontSize: 8 }}>
										{i18n.t("Liked")}
									</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>
						{dataInProf && (
							<FlatList
								contentContainerStyle={{ paddingHorizontal: 20, marginTop: 20 }}
								showsVerticalScrollIndicator={false}
								data={dataInProf}
								renderItem={(item) => <RecipeLikedItem item={item} />}
								keyExtractor={(item) => item.id.toString()}
							/>
						)}
					</SafeAreaView>
				</>
			) : (
				<SafeAreaView
					contentContainerStyle={{ flex: 1 }}
					// className="bg-red-500"
				>
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{ paddingHorizontal: 20, flex: 1 }}
						className="h-full"
					>
						{/*button go tu back*/}
						<View style={shadowBoxBlack()} className="mt-5">
							<ButtonBack />
						</View>

						{/*change lang*/}
						<View
							className=" h-full flex-1 justify-center
                            {/*bg-red-500*/}
                            "
						>
							{/*block login and sign up*/}
							<View
								className="mb-10 w-full flex-row   gap-10 justify-center
                                    {/*bg-red-500*/}
                                    "
								style={{ flexWrap: "wrap" }} // Добавляем перенос строк
							>
								{/*    log in*/}
								<TouchableOpacity
									onPress={() => router.push("/(auth)/LogInScreen")}
									style={shadowBoxBlack()}
									className="p-5 pl-10 pr-10 items-center justify-center  border-[1px] border-neutral-300 rounded-full bg-amber-300 "
								>
									<Text>{i18n.t("Log In")}</Text>
								</TouchableOpacity>

								{/*    sign Up*/}

								<TouchableOpacity
									onPress={() => router.push("/(auth)/RegistrationScreen")}
									style={shadowBoxBlack()}
									className="p-5 pl-10 pr-10 items-center justify-center  border-[1px] border-neutral-300 rounded-full bg-amber-300"
								>
									<Text>{i18n.t("Sign Up")}</Text>
								</TouchableOpacity>
							</View>

							{/*<TouchableOpacity*/}
							{/*    onPress={() => router.push('/ChangeLangScreen')}*/}
							{/*    style={shadowBoxBlack()}*/}
							{/*    className="p-5 items-center justify-center flex-row w-full border-[1px] border-neutral-300 rounded-full bg-amber-300"*/}
							{/*>*/}
							{/*    <Text>Change language App</Text>*/}
							{/*</TouchableOpacity>*/}
							{/*<View>*/}
							{/*    /!*Select lang*!/*/}
							{/*    <LanguagesWrapper setLang={setLang} lang={lang}/>*/}
							{/*</View>*/}
						</View>
					</ScrollView>
				</SafeAreaView>
			)}
		</>
	);
};

export default ProfileScreen;
