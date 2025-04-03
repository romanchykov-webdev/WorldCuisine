import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { hp } from "../../constants/responsiveScreen";
import { shadowBoxBlack } from "../../constants/shadow";
import ButtonSmallCustom from "../Buttons/ButtonSmallCustom";
import ModalEditComponent from "./ModalEditComponent";

const RefactorAreaComponent = ({ area, langApp, updateAreaText, Icon }) => {
	const [modalVisible, setModalVisible] = useState(false);

	// console.log("RefactorAreaComponent area", area);
	// console.log("RefactorAreaComponent langApp", langApp);

	// Извлекаем регион на основе текущего языка
	const displayArea = area?.[langApp] || "Неизвестный регион";

	// Функция обработки сохранения изменений
	const handleSave = (newText, lang) => {
		if (newText !== displayArea) {
			updateAreaText(newText, lang);
			// console.log(`Регион изменен с "${displayArea}" на "${newText}" для языка "${lang}"`);
		}
	};
	return (
		<View className="justify-center">
			<Text style={{ fontSize: hp(1.8) }} className="font-medium text-neutral-500">
				{displayArea}
			</Text>
			<TouchableOpacity
				onPress={() => setModalVisible(true)}
				style={shadowBoxBlack()}
				className="absolute top-[-10px] right-0"
			>
				<ButtonSmallCustom icon={Icon} bg="red" size={15} w={30} h={30} />
			</TouchableOpacity>

			{/* Модальное окно для региона */}
			<ModalEditComponent
				visible={modalVisible}
				initialText={displayArea}
				lang={langApp}
				type="area"
				onSave={handleSave}
				onClose={() => setModalVisible(false)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({});

export default RefactorAreaComponent;
