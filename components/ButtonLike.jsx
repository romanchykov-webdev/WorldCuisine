import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { HeartIcon } from "react-native-heroicons/solid";
import { shadowBoxWhite } from "../constants/shadow";

// translate
import { myFormatNumber, showCustomAlert } from "../constants/halperFunctions";
import i18n from "../lang/i18n";
import { addLikeRecipeMyDB, checkIfUserLikedRecipe } from "../service/getDataFromDB";

const ButtonLike = ({ user, recipeId, isPreview, totalCountLike }) => {
	// console.log('ButtonLike user.id',user.id)
	// console.log('ButtonLike recipeId',recipeId)
	// console.log("ButtonLike preview", isPreview);
	// console.log("ButtonLike totalCountLike", totalCountLike);

	const [isLike, setIsLike] = useState(false);

	const router = useRouter();

	const fetchGetLikes = async () => {
		if (user !== null && isPreview === false) {
			const res = await checkIfUserLikedRecipe({
				recipeId: recipeId,
				userId: user.id,
			});
			setIsLike(res?.liked);
			console.log("res", res.liked);
		} else {
			setIsLike(false);
		}
	};

	const toggleLike = async () => {
		if (isPreview) return; //если это предпросмотр

		if (user === null) {
			showCustomAlert(
				"Like",
				`${i18n.t("To add a recipe to your favorites you must log in or create an account")}`,
				router
			);
			// Alert.alert(
			// 	"Like",
			// `${i18n.t(
			// 	"To add a recipe to your favorites you must log in or create an account"
			// )}`,
			// 	[
			// 		{
			// 			text: "Cancel",
			// 			onPress: () => console.log("modal cancelled"),
			// 			style: "cancel",
			// 		},
			// 		{
			// 			text: "LogIn-SignUp",
			// 			onPress: () => router.replace("/ProfileScreen"),
			// 			style: "default",
			// 		},
			// 	]
			// );
			// Alert.alert("",{i18n.t('To rate a recipe you must log in or create an account')})
		} else {
			setIsLike(!isLike);
			// add new like
			await addLikeRecipeMyDB({
				recipeId: recipeId,
				userIdLike: user?.id,
			});
		}
	};

	useEffect(() => {
		fetchGetLikes();
	}, []);

	return (
		<TouchableOpacity
			onPress={toggleLike}
			className="w-[50] h-[50] justify-center items-center bg-white rounded-full relative"
			style={shadowBoxWhite()}
		>
			{isLike ? <HeartIcon size={30} color="red" /> : <HeartIcon size={30} color="gray" />}

			<Text className="absolute text-[8px] text-neutral-900">{myFormatNumber(totalCountLike)}</Text>
		</TouchableOpacity>
	);
};

export default ButtonLike;
