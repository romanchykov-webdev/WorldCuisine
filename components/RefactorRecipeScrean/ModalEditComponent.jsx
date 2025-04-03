import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { hp } from "../../constants/responsiveScreen";
import i18n from "../../lang/i18n";

const ModalEditComponent = ({ visible, initialText, lang, type, onSave, onClose }) => {
	const [text, setText] = useState(initialText);

	// Обновляем текст, если initialText изменился (например, при повторном открытии модального окна)
	useEffect(() => {
		setText(initialText || "");
	}, [initialText, visible]); // Обновляем, когда visible или initialText меняются

	const handleSave = () => {
		onSave(text, lang);
		onClose();
	};

	let titleModal = "";

	switch (type) {
		case "tags":
			titleModal = `${i18n.t("Add new tag")}`;
			break;

		default:
			titleModal = `${i18n.t("Edit")} ${lang?.toUpperCase() || ""}`;
			break;
	}

	return (
		<Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContent}>
					<Text style={styles.modalTitle}>{titleModal}</Text>
					<TextInput style={styles.input} value={text} onChangeText={setText} autoFocus />
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
});

export default ModalEditComponent;
