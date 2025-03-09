import React from "react";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { shadowBoxBlack } from "../../constants/shadow";

const SocialLinksComponent = ({ socialLinks }) => {
	console.log("SocialLinksComponent socialLinks", socialLinks);
	const handleOpenOriginal = (value) => {
		Linking.openURL(value).catch((err) => console.error("Failed to open URL:", err));
	};

	// Функция для получения цвета в RGBA формате
	const getRGBAColor = (key, opacity = 0.5) => {
		const colorMap = {
			tiktok: "0,0,0", // Черный
			facebook: "24,119,242", // Синий
			instagram: "193,53,132", // Красновато-фиолетовый
		};
		return `rgba(${colorMap[key] || "128,128,128"}, ${opacity})`; // Серый по умолчанию
	};

	return (
		<View className="mb-5 justify-around items-center flex-row gap-x-3">
			{Object.entries(socialLinks).map(([key, value]) => {
				// Проверяем, поддерживается ли иконка
				const supportedIcons = ["facebook", "instagram", "tiktok"];
				if (!supportedIcons.includes(key)) return null;
				return (
					<TouchableOpacity
						style={[
							styles.button,
							{ backgroundColor: getRGBAColor(key) },
							shadowBoxBlack({ offset: { width: 5, height: 5 }, opacity: 0.7 }),
						]}
						onPress={() => handleOpenOriginal(value)}
						key={key}
						className="bg-white p-5 rounded-[12]"
					>
						<Icon
							name={key}
							size={50}
							color={getRGBAColor(key, 1)}
							style={shadowBoxBlack({
								offset: { width: 2, height: 2 },
								opacity: 0.2,
								radius: 3,
							})}
						/>
					</TouchableOpacity>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({});

export default SocialLinksComponent;
