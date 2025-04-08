import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { LinkIcon, PlusIcon } from "react-native-heroicons/mini";
import { useDebounce } from "../../constants/halperFunctions";
import { shadowBoxBlack } from "../../constants/shadow";
import i18n from "../../lang/i18n";
import ButtonClearInputCustomComponent from "../ButtonClearInputCustomComponent";
import ButtonSmallCustom from "../Buttons/ButtonSmallCustom";
import InputComponent from "../InputComponent";
import SocialMediaEmbedComponent from "./SocialMediaEmbedComponent";
import TitleDescriptionComponent from "./TitleDescriptionComponent";

const AddLinkSocialComponent = ({
	setTotalRecipe,
	refactorRecipescrean = false,
	oldSocialLinks,
	updateSocialLinks,
}) => {
	const [inputValue, setInputValue] = useState("");

	// // opacity for animatio
	// const opacity = useSharedValue(0);
	// // Создаем стиль для анимации
	// const animatedStyle = useAnimatedStyle(() => ({
	// 	opacity: opacity.value,
	// }));
	console.log("AddLinkSocialComponent oldSocialLinks", oldSocialLinks);

	const [previewUrl, setPreviewUrl] = useState({
		facebook: null,
		instagram: null,
		tiktok: null,
	});

	// Инициализация previewUrl только при первом рендере или изменении oldSocialLinks
	useEffect(() => {
		if (refactorRecipescrean && oldSocialLinks) {
			setPreviewUrl((prev) => ({
				...prev,
				facebook: oldSocialLinks.facebook || null,
				instagram: oldSocialLinks.instagram || null,
				tiktok: oldSocialLinks.tiktok || null,
			}));
		}
	}, []);

	// Добавляем дебонсированное значение
	const debouncedValue = useDebounce(previewUrl, 1000);

	useEffect(() => {
		if (refactorRecipescrean && updateSocialLinks) {
			updateSocialLinks(previewUrl); // Передаём текущее значение напрямую
		} else if (setTotalRecipe) {
			setTotalRecipe((prevRecipe) => ({
				...prevRecipe,
				social_links: debouncedValue,
			}));
		}
	}, [debouncedValue, refactorRecipescrean, updateSocialLinks, setTotalRecipe]);
	// -------------------------------

	// useEffect(() => {
	// 	opacity.value = withTiming(inputValue.length > 0 ? 1 : 0, { duration: 100 });
	// }, [inputValue]);

	// Функция для определения платформы по URL
	const determinePlatform = (url) => {
		if (!url) return null;
		url = url.toLowerCase();
		if (url.includes("facebook.com")) return "facebook";
		if (url.includes("instagram.com")) return "instagram";
		if (url.includes("tiktok.com")) return "tiktok";
		return null;
	};

	// const handleAddLink = () => {
	// 	if (inputValue.trim() === "") {
	// 		Alert.alert(`${i18n.t("Add link")}`, `${i18n.t("Please enter a valid link")}`);
	// 		return;
	// 	}

	// 	const platform = determinePlatform(inputValue);
	// 	if (!platform) {
	// 		Alert.alert(
	// 			`${i18n.t("Invalid link")}`,
	// 			`${i18n.t("Please enter a valid link")} ${i18n.t("from Facebook, Instagram, or TikTok")}`
	// 		);
	// 		return;
	// 	}

	// 	// Проверяем, не добавлена ли уже ссылка для этой платформы
	// 	if (previewUrl[platform]) {
	// 		Alert.alert(
	// 			`${i18n.t("Link already added")} ${platform}`,
	// 			`${i18n.t("If you want to update or change the link")}.`
	// 		);
	// 		return;
	// 	}

	// 	// Добавляем ссылку в previewUrl
	// 	setPreviewUrl((prev) => ({
	// 		...prev,
	// 		[platform]: inputValue,
	// 	}));
	// 	setInputValue(""); // Очищаем поле ввода после добавления
	// };

	const handleAddLink = () => {
		if (inputValue.trim() === "") {
			Alert.alert(`${i18n.t("Add link")}`, `${i18n.t("Please enter a valid link")}`);
			return;
		}

		const platform = determinePlatform(inputValue);
		if (!platform) {
			Alert.alert(
				`${i18n.t("Invalid link")}`,
				`${i18n.t("Please enter a valid link")} ${i18n.t("from Facebook, Instagram, or TikTok")}`
			);
			return;
		}

		// Проверяем, не добавлена ли уже ссылка для этой платформы
		if (previewUrl[platform]) {
			Alert.alert(
				`${i18n.t("Link already added for")} ${platform}`,
				`${i18n.t("Do you want to replace the existing link?")}`,
				[
					{
						text: `${i18n.t("No")}`,
						onPress: () => {},
						style: "cancel",
					},
					{
						text: `${i18n.t("Yes")}`,
						onPress: () => {
							// Заменяем существующую ссылку на новую
							setPreviewUrl((prev) => ({
								...prev,
								[platform]: inputValue,
							}));
							setInputValue(""); // Очищаем поле ввода после замены
						},
					},
				],
				{ cancelable: true }
			);
			return;
		}

		// Если ссылки для этой платформы еще нет, добавляем новую
		setPreviewUrl((prev) => ({
			...prev,
			[platform]: inputValue,
		}));
		setInputValue(""); // Очищаем поле ввода после добавления
	};

	return (
		<View>
			<TitleDescriptionComponent
				titleVisual={true}
				titleText={`${i18n.t("Here you can add links to Facebook, Instagram, TikTok")}`}
				// styleTitle={{ textAlign: "center" }}
				descriptionVisual={true}
				descriptionText={`${i18n.t("If you want to add links to your facebook instagram tiktok")}`}
			/>

			{/* block visual link social */}
			{(previewUrl.facebook || previewUrl.instagram || previewUrl.tiktok) && (
				<View className="">
					<SocialMediaEmbedComponent previewUrl={previewUrl} setPreviewUrl={setPreviewUrl} />
				</View>
			)}

			<View className="flex-row gap-x-1 justify-between items-center ">
				{/* input block */}
				<View className="ralative flex-1">
					<InputComponent
						containerStyle={{ marginBottom: 0 }}
						icon={<LinkIcon size={20} color={"grey"} />}
						placeholder={`${i18n.t("Add link")}`}
						value={inputValue}
						onChangeText={setInputValue}
					/>

					{/* button remove value input */}
					{/* {inputValue.length > 0 && ( */}
					{inputValue.length > 0 && (
						<ButtonClearInputCustomComponent
							top={-15}
							left={-5}
							inputValue={inputValue}
							setInputValue={setInputValue}
						/>
					)}
				</View>

				{/* button Add link to social */}
				<TouchableOpacity onPress={handleAddLink} style={shadowBoxBlack()}>
					<ButtonSmallCustom icon={PlusIcon} bg="green" w={60} h={60} />
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({});

export default AddLinkSocialComponent;
