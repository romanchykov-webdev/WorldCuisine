import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/mini";
import { hp } from "../constants/responsiveScreen";
import { shadowBoxBlack } from "../constants/shadow";
import i18n from "../lang/i18n";
import { createPulseAnimationCircle } from "../utils/animations";
import ButtonClearInputCustomComponent from "./ButtonClearInputCustomComponent";

const SearchComponent = () => {
	const [inpurSearch, setInpurSearch] = useState("");
	const pulseScaleAnim = useRef(new Animated.Value(0)).current; // Масштаб начинается с 0
	const pulseOpacityAnim = useRef(new Animated.Value(0)).current; // Прозрачность начинается с 0
	const animationLoop = useRef(null); // Храним ссылку на цикл анимации

	useEffect(() => {
		if (inpurSearch !== "") {
			// Запускаем анимацию
			animationLoop.current = createPulseAnimationCircle({
				scaleAnim: pulseScaleAnim,
				opacityAnim: pulseOpacityAnim,
				duration: 1600,
				scaleFrom: 0,
				scaleTo: 1,
				opacityFrom: 0,
				opacityTo: 1,
				useNativeDriver: true,
			});
		} else {
			// Останавливаем анимацию
			if (animationLoop.current) {
				animationLoop.current.stop(); // Останавливаем цикл
				animationLoop.current = null;
			}
			// Возвращаем значения к 0
			Animated.parallel([
				Animated.timing(pulseScaleAnim, {
					toValue: 0,
					duration: 200,
					useNativeDriver: true,
				}),
				Animated.timing(pulseOpacityAnim, {
					toValue: 0,
					duration: 200,
					useNativeDriver: true,
				}),
			]).start();
		}

		return () => {
			// Очистка при размонтировании
			if (animationLoop.current) {
				animationLoop.current.stop();
				animationLoop.current = null;
			}
		};
	}, [inpurSearch]);

	return (
		<View style={shadowBoxBlack} className="rounded-full bg-black/5 p-[6] mt-5 mb-5 relative">
			<View className="flex-row items-center rounded-full bg-transparent">
				<TextInput
					placeholder={i18n.t("Search any food")}
					placeholderTextColor="gray"
					style={[{ fontSize: hp(1.7) }]}
					className="flex-1 text-base tracking-wider p-3 mb-1"
					value={inpurSearch}
					onChangeText={(val) => setInpurSearch(val)}
				/>
				<TouchableOpacity className="bg-white rounded-full p-5 overflow-hidden">
					<View style={styles.iconContainer}>
						{/* Анимированная обводка */}
						<Animated.View
							style={[
								styles.borderCircle,
								{
									transform: [{ scale: pulseScaleAnim }],
									opacity: pulseOpacityAnim,
								},
							]}
						/>
						{/* Иконка лупы */}
						<MagnifyingGlassIcon size={hp(2.5)} color="gray" />
					</View>
				</TouchableOpacity>
			</View>
			{inpurSearch.length > 0 && (
				<ButtonClearInputCustomComponent
					top={-15}
					left={-5}
					inputValue={inpurSearch}
					setInputValue={setInpurSearch}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	iconContainer: {
		position: "relative",
		alignItems: "center",
		justifyContent: "center",
	},
	borderCircle: {
		position: "absolute",
		width: hp(2.5) + 50, // Размер TouchableOpacity (иконка + padding)
		height: hp(2.5) + 50,
		borderRadius: 100,
		borderWidth: 15,
		borderColor: "rgba(0,0,0,0.1)",
		backgroundColor: "transparent",
	},
});

export default SearchComponent;
