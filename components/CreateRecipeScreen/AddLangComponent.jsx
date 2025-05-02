import React, { useEffect } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { PlusIcon } from "react-native-heroicons/mini";
import {shadowBoxBlack, shadowBoxWhite} from "../../constants/shadow";
import i18n from "../../lang/i18n";
import ButtonSmallCustom from "../Buttons/ButtonSmallCustom";
import {themes} from "../../constants/themes";
import {useAuth} from "../../contexts/AuthContext";

const AddLangComponent = ({ languages, totLang, langDev, selectLanguage, modalVisible, setModalVisible }) => {
	// для выбора языка
	// const [modalVisible, setModalVisible] = useState(false);
	const {currentTheme}=useAuth()

	useEffect(() => {
		// console.log("languages:", languages);
		// console.log("totLang:", totLang);
		// console.log("langDev:", langDev);
	}, [languages, totLang, langDev]);

	// Убираем язык, совпадающий с langDev
	// let filterLang = languages?.filter(
	//     language => language?.code.toLowerCase() !== langDev.toLowerCase()
	// );
	let filterLang = languages?.filter((language) => language?.code && langDev && language.code.toLowerCase() !== langDev.toLowerCase());

	// Убираем языки, которые уже есть в totLang
	// if (totLang?.length > 0) {
	//     filterLang = filterLang?.filter(
	//         language => !totLang?.some(totLangItem => totLangItem.toLowerCase() === language.name.toLowerCase())
	//     );
	// }
	// Убираем языки, которые уже есть в totLang
	if (totLang?.length > 0) {
		filterLang = filterLang?.filter((language) => language?.name && totLang?.every((totLangItem) => totLangItem && totLangItem.toLowerCase() !== language.name.toLowerCase()));
	}

	const handleAddLang = () => {
		setModalVisible(true);
	};

	// для выбора языка end

	return (
		<View style={styles.container}>
			<TouchableOpacity
				className="w-[100%]"
				// className="p-5 w-full items-center justify-center bg-amber-500 rounded-[15]"
				style={currentTheme==="light"?shadowBoxBlack():shadowBoxWhite()}
				onPress={handleAddLang}
			>
				{/*<Text*/}
				{/*style={{fontSize:hp(2)}}*/}
				{/*    className="font-bold"*/}
				{/*>*/}
				{/*    Add translate lang*/}
				{/*</Text>*/}
				<ButtonSmallCustom icon={PlusIcon} w="100%" h={60} bg="green" title={i18n.t("Add translation language")} buttonText={true} styleWrapperButton={{}} />
			</TouchableOpacity>

			{/* ModalCustom for selecting language */}
			<Modal
				animationType="fade"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
				// onRequestClose={closeModal}
			>
				<TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
					<View style={styles.modalOverlay}>
						<View style={[styles.modalContent,{backgroundColor:themes[currentTheme]?.backgroundColor}]} >
							<Text style={[styles.modalTitle,{color:themes[currentTheme]?.textColor}]}>{i18n.t("Select Language")}</Text>

							<FlatList
								data={filterLang}
								keyExtractor={(item) => item.code}
								renderItem={({ item,index }) => (
									<TouchableOpacity style={[styles.langOption,index===filterLang.length-1 && {borderBottomColor:"transparent"}]} onPress={() => selectLanguage(item)}>
										<Text style={[styles.langText,{color:themes[currentTheme]?.textColor}]}>{item.name}</Text>
									</TouchableOpacity>
								)}
							/>

							<TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
								<Text style={styles.cancelText}>Cancel</Text>
							</TouchableOpacity>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		// backgroundColor:'red'
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		width: "80%",
		// backgroundColor: "#fff",
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
	langOption: {
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
	},
	langText: {
		fontSize: 16,
	},
	cancelButton: {
		marginTop: 15,
		padding: 10,
		backgroundColor: "#f44336",
		borderRadius: 5,
		alignItems: "center",
	},
	cancelText: {
		color: "#fff",
		fontSize: 16,
	},
	selectedLangText: {
		marginTop: 20,
		fontSize: 16,
		fontStyle: "italic",
	},
});

export default AddLangComponent;
