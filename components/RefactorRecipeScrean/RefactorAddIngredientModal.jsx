import React, { useEffect, useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { hp } from "../../constants/responsiveScreen";
import { useAuth } from "../../contexts/AuthContext";
import i18n from "../../lang/i18n";

const RefactorAddIngredientModal = ({
	visible,
	onClose,
	onSave,
	quontityLang = [],
	measurement,
	validateIngredientData,
}) => {
	const [ingredientsByLang, setIngredientsByLang] = useState({});
	const [quantity, setQuantity] = useState("1");
	const [unit, setUnit] = useState("");
	const [measurementLangApp, setMeasurementLangApp] = useState([]);
	const { language: appLang } = useAuth();

	useEffect(() => {
		if (!visible) return;

		// Инициализируем пустые поля для каждого языка
		const initialDataByLang = {};
		quontityLang.forEach((langItem) => {
			initialDataByLang[langItem] = { ingredient: "", quantity: "1", unit: "" };
		});
		setIngredientsByLang(initialDataByLang);
		setQuantity("1");
		setUnit("");
	}, [visible, quontityLang]);

	useEffect(() => {
		if (measurement && measurement[appLang]) {
			setMeasurementLangApp(
				Object.entries(measurement[appLang]).map(([key, val]) => ({
					key,
					val,
				}))
			);
		} else {
			setMeasurementLangApp([]);
		}
	}, [measurement]);

	const handleSave = () => {
		// Проверка на заполненность всех полей
		// const isQuantityValid = quantity > 0; // Проверяем, что количество больше 0
		// const isUnitValid = unit !== ""; // Проверяем, что единица измерения выбрана
		// const areIngredientsValid = quontityLang.every(
		// (langItem) => ingredientsByLang[langItem]?.ingredient?.trim() !== ""
		// ); // Проверяем, что все ингредиенты заполнены

		// console.log("RefactorAddIngredientModal handleSave areIngredientsValid", areIngredientsValid);
		// console.log("RefactorAddIngredientModal handleSave quantity", quantity);
		// console.log("RefactorAddIngredientModal handleSave unit", unit);
		// console.log("RefactorAddIngredientModal handleSave isQuantityValid", isQuantityValid);

		// if (!isQuantityValid || !isUnitValid || !areIngredientsValid) {
		// Alert.alert(
		// 	i18n.t("Attention"),
		// 	`${i18n.t("Please fill in all fields")} : ${i18n.t("ingredient name, quantity, and unit")}`
		// );
		// } else {
		// 	const updatedData = { ...ingredientsByLang };
		// 	quontityLang.forEach((langItem) => {
		// 		updatedData[langItem] = { ...updatedData[langItem], quantity, unit };
		// 	});
		// 	onSave(updatedData);
		// 	onClose();
		// }

		// Используем общую функцию валидации else true avanti else false alert
		// if (validateIngredientData(ingredientsByLang, quantity, unit, quontityLang)) {
		// 	const updatedData = { ...ingredientsByLang };
		// 	quontityLang.forEach((langItem) => {
		// 		updatedData[langItem] = { ...updatedData[langItem], quantity, unit };
		// 	});
		// 	onSave(updatedData);
		// 	onClose();
		// }
		const updatedData = { ...ingredientsByLang };
		quontityLang.forEach((langItem) => {
			updatedData[langItem] = { ...updatedData[langItem], quantity, unit };
		});

		if (validateIngredientData(updatedData, quontityLang)) {
			onSave(updatedData);
			onClose();
		}
	};

	const handleIngredientChange = (langItem, value) => {
		setIngredientsByLang((prev) => ({
			...prev,
			[langItem]: { ...prev[langItem], ingredient: value },
		}));
	};

	const handleSelectUnit = (key, val) => {
		setUnit(val);
	};

	return (
		<Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContent}>
					<Text style={styles.modalTitle}>{i18n.t("Add new ingredient")}</Text>
					<View className="w-full">
						{quontityLang.map((langItem) => (
							<View key={langItem} className="mb-1">
								<TextInput
									style={styles.input}
									value={ingredientsByLang[langItem]?.ingredient || ""}
									onChangeText={(value) => handleIngredientChange(langItem, value)}
									autoFocus={langItem === quontityLang[0]}
									placeholder={`${langItem.toUpperCase()}`}
								/>
							</View>
						))}
						<TextInput
							value={quantity}
							onChangeText={(value) => {
								if (/^\d*$/.test(value)) setQuantity(value);
							}}
							keyboardType="numeric"
							style={styles.input}
							className="text-center"
						/>
						<FlatList
							data={measurementLangApp}
							keyExtractor={(item) => item.key}
							renderItem={({ item }) => (
								<TouchableOpacity
									style={styles.langOption}
									onPress={() => handleSelectUnit(item.key, item.val)}
								>
									<Text
										style={styles.langText}
										className={`${
											unit === item.val ? "text-amber-500 font-bold" : "text-neutral-900"
										}`}
									>
										{item.val}
									</Text>
								</TouchableOpacity>
							)}
							style={styles.flatList}
						/>
					</View>
					<View style={styles.buttonContainer}>
						<TouchableOpacity style={styles.button} onPress={handleSave}>
							<Text style={styles.buttonText}>{i18n.t("Save")}</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.button} onPress={onClose}>
							<Text style={styles.buttonText}>{i18n.t("Cancel")}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: "80%",
		backgroundColor: "white",
		padding: 20,
		borderRadius: 10,
		alignItems: "center",
	},
	modalTitle: {
		fontSize: hp(2.5),
		fontWeight: "bold",
		marginBottom: 15,
	},
	input: {
		width: "100%",
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		padding: 10,
		fontSize: hp(2),
		marginBottom: 20,
	},
	langLabel: {
		fontSize: hp(2),
		fontWeight: "bold",
		marginBottom: 5,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	button: {
		backgroundColor: "#ff4444",
		padding: 10,
		borderRadius: 5,
		width: "45%",
		alignItems: "center",
	},
	buttonText: {
		color: "white",
		fontSize: hp(2),
		fontWeight: "bold",
	},
	langOption: {
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
		marginBottom: 10,
	},
	langText: {
		fontSize: 16,
		textAlign: "center",
	},
	flatList: {
		maxHeight: hp(40),
	},
});

export default RefactorAddIngredientModal;
