import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { shadowBoxBlack } from "../constants/shadow";

const ModalClearCustom = ({
	isModalVisible,
	animationType = "fade",
	handleSave,
	closeModal,
	titleHeader,
	textButton,
	childrenSubheader,
	children,
	fullWidth = false, // Новый пропс: если true – модальное окно занимает 98% ширины экрана
}) => {
	// console.log(inputLink);

	return (
		<Modal
			animationType={animationType}
			transparent={true}
			visible={isModalVisible}
			onRequestClose={closeModal}
			// onRequestClose={closeModal}
		>
			<TouchableWithoutFeedback onPress={closeModal}>
				<View style={styles.modalOverlay}>
					<View style={[styles.modalContent, fullWidth && { width: "98%" }]}>
						<View>
							<Text style={styles.modalTitle}>{titleHeader}</Text>

							{childrenSubheader}
						</View>

						{children}

						<View className="flex-row gap-x-2">
							<TouchableOpacity style={[styles.cancelButton, shadowBoxBlack()]} onPress={handleSave}>
								<Text style={styles.cancelText}>{textButton}</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

const styles = StyleSheet.create({
	scrollContainer: {
		paddingBottom: 20,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		width: "80%",
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 20,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 15,
		textAlign: "center",
	},
	cancelButton: {
		marginTop: 15,
		padding: 10,
		backgroundColor: "green",
		borderRadius: 5,
		alignItems: "center",
		flex: 1,
	},
	cancelText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 18,
	},
});

export default ModalClearCustom;
