import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/mini";
import { hp } from "../constants/responsiveScreen";
import { shadowBoxBlack } from "../constants/shadow";

import { createPulseAnimation } from "../utils/animations";

// translate
import i18n from "../lang/i18n";

const SearchComponent = () => {
	const [inpurSearch, setInpurSearch] = useState("");

	// Инициализируем pulseAnim как Animated.Value напрямую
	// const pulseAnim = useRef(new Animated.Value(1)).current;
	useEffect(() => {
		if (inpurSearch !== "") {
			createPulseAnimation({
				id: "search",
				animationRef: { current: pulseAnim },
				duration: 1400,
				scaleFrom: 1,
				escalateTo: 1.5,
				useNativeDriver: true,
			});
		}
	}, []);

	return (
		<View style={shadowBoxBlack} className="rounded-full bg-black/5 p-[6] mt-5 mb-5">
			<View className="flex-row items-center rounded-full bg-transparent">
				<TextInput
					placeholder={i18n.t("Search any food")}
					placeholderTextColor="gray"
					style={[{ fontSize: hp(1.7) }]}
					className="flex-1 text-base tracking-wider p-3 mb-1"
				/>
				<TouchableOpacity className="bg-white rounded-full p-5">
					<MagnifyingGlassIcon size={hp(2.5)} color="gray" />
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({});

export default SearchComponent;
