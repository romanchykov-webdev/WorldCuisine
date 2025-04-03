import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PlusIcon, XMarkIcon } from "react-native-heroicons/outline";
import { shadowBoxBlack } from "../../constants/shadow";
import i18n from "../../lang/i18n";
import ButtonSmallCustom from "../Buttons/ButtonSmallCustom";
import ModalEditComponent from "./ModalEditComponent";

const RefactorTagsComponent = ({ tags, updateTags, langApp }) => {
	// console.log("RefactorTagsComponent tags", tags);

	const [modalVisible, setModalVisible] = useState(false);
	//
	const [newTag, setNewTag] = useState("");

	// Инициализируем arrTags значением из пропса tags или пустым массивом
	const [arrTags, setArrTags] = useState(tags || []);

	//
	useEffect(() => {
		// Синхронизируем arrTags с tags при изменении пропса
		setArrTags(tags || []);
	}, [tags]);
	console.log("RefactorTagsComponent arrTags", arrTags);

	// Добавление нового тега
	const handleSave = (tagText) => {
		if (tagText && !arrTags.includes(tagText)) {
			// Проверяем, что тег не пустой и уникальный
			const updatedTags = [...arrTags, tagText]; // Добавляем новый тег в массив
			setArrTags(updatedTags); // Обновляем локальное состояние
			updateTags(updatedTags); // Передаем обновленный массив в родительский компонент
		}
		setNewTag(""); // Очищаем поле ввода
	};

	// Удаление тега
	const removeTag = (tag) => {
		if (arrTags.length <= 1) {
			Alert.alert(`${i18n.t("There must be at least one tag")}`);
		} else {
			const remove = arrTags.filter((item) => item !== tag);
			setArrTags(remove); // Обновляем локальное состояние
			updateTags(remove); // Передаем обновленный массив в родительский компонент
		}
	};

	return (
		<View className="flex-row  justify-between items-center">
			<View className="flex-row flex-wrap gap-5 flex-1">
				{arrTags?.map((item, index) => {
					return (
						<View
							style={shadowBoxBlack()}
							className="px-5 py-2 border-[1px] border-neutral-500 rounded-[15px] bg-white flex-row relative"
							key={index}
						>
							<Text>{item}</Text>
							<TouchableOpacity
								onPress={() => removeTag(item)}
								className="absolute top-[-5px] right-[-5px]"
							>
								<ButtonSmallCustom icon={XMarkIcon} bg="red" w={20} h={20} />
							</TouchableOpacity>
						</View>
					);
				})}
			</View>

			<TouchableOpacity onPress={() => setModalVisible(true)} style={shadowBoxBlack()}>
				<ButtonSmallCustom icon={PlusIcon} bg="green" />
			</TouchableOpacity>

			{/* Модальное окно для региона */}
			<ModalEditComponent
				visible={modalVisible}
				initialText={newTag}
				lang={langApp}
				type="tags"
				onSave={handleSave}
				onClose={() => setModalVisible(false)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({});

export default RefactorTagsComponent;
