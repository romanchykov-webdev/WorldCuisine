import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { langArray } from "../../constants/langArray";
import AddLangComponent from "./AddLangComponent";

// icons
import { TrashIcon } from "react-native-heroicons/mini";

import { useDebounce } from "../../constants/halperFunctions";

const InputCustomComponent = ({
	styleTextDesc,
	styleInput,
	langDev,
	setTotalLangRecipe,
	totalLangRecipe,
	setTotalRecipe,
	totalRecipe,
}) => {
	const [choiceLang, setChoiceLang] = useState(null);
	const [selectedLang, setSelectedLang] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);

	const [translations, setTranslations] = useState({});

	const [languages, setLanguages] = useState([]);

	const [totLang, setTotLang] = useState([]);

	const [totalTitle, setTotalTitle] = useState({});

	// Добавляем дебонсированное значение
	const debouncedInputValue = useDebounce(totalTitle, 1000); // 1000мс = 1 секунда

	useEffect(() => {
		setLanguages(langArray);
	}, [languages]);

	useEffect(() => {
		const res = languages?.filter(
			(language) => language.code.toString() === langDev.toLowerCase()
		);
		// console.log('res',res[0]?.name)
		setTotLang([res[0]?.name]);
	}, [languages]);
	// console.log(langDev)

	const selectLanguage = (lang) => {
		setSelectedLang(lang);
		setModalVisible(false);
		if (
			!totLang.some(
				(item) => item.toLowerCase() === lang.name.toLowerCase()
			)
		) {
			setTotLang([...totLang, lang.name]);
		}

		if (!totalLangRecipe.includes(lang.code)) {
			setTotalLangRecipe((prev) => [...prev, lang.code]);
		}
	};
	// console.log(totLang)

	const removeLang = (lang) => {
		const res = totLang.filter((item) => item !== lang);
		// console.log(" removeLang lang", lang);
		const updatedLangCodes = totalLangRecipe.filter((code) => {
			const langObj = languages.find((l) => l.code === code);
			return langObj?.name !== lang;
		});
		setTotLang(res);
		// console.log(' removeLang updatedLangCodes', updatedLangCodes)
		// console.log(' removeLang res', res)
		setTotalLangRecipe(updatedLangCodes); // Передаем обновленный список языков
	};

	useEffect(() => {
		setTotalRecipe((prevRecipe) => ({
			...prevRecipe,
			title: debouncedInputValue,
		}));
	}, [debouncedInputValue, setTotalRecipe]);

	const debouncedUpdateTranslations = (
		updatedTranslations,
		setTotalTitle,
		langDev
	) => {
		const langArray = Object.keys(updatedTranslations).map((key) => ({
			lang: key,
			name: updatedTranslations[key],
		}));

		const str = langArray.find((item) => item.lang === "ua")?.name || "";
		setTotalTitle({
			lang: langArray,
			strTitle: str,
		});
	};

	const handleTextChange = (langCode, value) => {
		const updatedTranslations = { ...translations, [langCode]: value };
		setTranslations(updatedTranslations);
		debouncedUpdateTranslations(
			updatedTranslations,
			setTotalTitle,
			langDev
		);
	};

	return (
		<View>
			<Text style={styleTextDesc}>Название блюда</Text>
			{totLang &&
				totLang?.map((lang, index) => {
					// console.log("totLang", lang);
					const langCode = languages.find(
						(language) => language.name === lang
					)?.code;
					return (
						<View key={index} className="mb-5">
							<Text
								style={styleTextDesc}
								// className="pl-2 mb-2"
							>
								Language {lang}
							</Text>
							<View className="flex-row items-center ">
								<TextInput
									value={translations[langCode] || ""}
									onChangeText={(value) =>
										handleTextChange(langCode, value)
									}
									style={styleInput}
									placeholder="Enter new recipe name"
									placeholderTextColor="grey"
								/>
								{/*<CustomTextInputTitle styleInput={styleInput} languages={languages} lang={lang}*/}
								{/*                      langDev={langDev}/>*/}
								{totLang[0] !== lang && (
									<TouchableOpacity
										// style={shadowBoxBlack()}
										onPress={() => removeLang(lang)}
										className="w-[60] h-[60] ml-2 bg-red-500 border-[1px] border-neutral-300 rounded-[10] justify-center items-center"
									>
										<TrashIcon color="white" size={30} />
									</TouchableOpacity>
								)}
							</View>
						</View>
					);
				})}

			<AddLangComponent
				languages={languages}
				selectLanguage={selectLanguage}
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
				totLang={totLang}
				langDev={langDev}
			/>
		</View>
	);
};

export default InputCustomComponent;
