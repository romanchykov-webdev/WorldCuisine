import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { hp } from "../../constants/responsiveScreen";
import { shadowBoxBlack } from "../../constants/shadow";
import ButtonSmallCustom from "../Buttons/ButtonSmallCustom";
import ModalEditComponent from "./ModalEditComponent";

const RefactorTitle = ({ title, langApp, updateHeaderTitle, Icon }) => {
	// console.log("RefactorTitleAria title", title);
	// console.log("RefactorTitleAria area", area);

	const [modalVisible, setModalVisible] = useState(false);

	// Извлекаем название на основе текущего языка
	const displayTitle = title?.lang?.find((item) => item.lang === langApp)?.name || title?.strTitle || "Без названия";

	// Функция обработки сохранения изменений
	const handleSave = (newText, lang) => {
		if (newText !== displayTitle) {
			updateHeaderTitle(newText, lang);
			console.log(`Заголовок изменен с "${displayTitle}" на "${newText}" для языка "${lang}"`);
		}
		setModalVisible(false); // Закрываем модальное окно
	};

	return (
		<View className=" ">
			{/*    name and area*/}

			<View className="flex-1 flex-row justify-between ">
				<Text style={[{ fontSize: hp(2.7) }]} className="font-bold flex-1 text-neutral-700">
					{displayTitle}
				</Text>

				{/* buttom refactor */}
				<TouchableOpacity
					onPress={() => setModalVisible(true)}
					style={shadowBoxBlack()}
					// className="absolute top-[-5px] right-0"
				>
					<ButtonSmallCustom icon={Icon} tupeButton="refactor" size={15} w={30} h={30} />
				</TouchableOpacity>
			</View>

			{/* Модальное окно */}
			<ModalEditComponent
				visible={modalVisible}
				initialData={displayTitle}
				lang={langApp}
				type="title"
				onSave={handleSave}
				onClose={() => setModalVisible(false)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({});

export default RefactorTitle;
