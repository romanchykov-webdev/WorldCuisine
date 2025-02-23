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
					console.log("totLang", lang);
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

// const CustomTextInputTitle = ({styleInput, languages, lang, langDev}) => {
//
//     const [textInput, setTextInput] = useState("")
//
//     const [langEn, setLangEn] = useState({lang: "en", name: ""})
//     const [langRu, setLangRu] = useState({lang: "ru", name: ""})
//     const [langEs, setLangEs] = useState({lang: "es", name: ""})
//     const [langIt, setLangIt] = useState({lang: "it", name: ""})
//     const [langUa, setLangUa] = useState({lang: "ua", name: ""})
//
//
//     // const changeTextInput=(value)=>{
//     //     setTextInput(value)
//     //     console.log("value",value)
//     //     console.log("languages",languages)
//     //     console.log("lang",lang)
//     //     console.log("langDev",langDev)
//     //
//     //     let tempLang = "";
//     //     const language = languages.find((l) => l.name === lang);
//     //     if (language) {
//     //         tempLang = language.code;
//     //         // Создаем новый объект для добавления в массив `lang`
//     //         const newLangObject = {
//     //             lang: tempLang,
//     //             name: value,
//     //         };
//     //         if(tempLang ===langDev){
//     //             setTotalLang({
//     //                 ...totalLang, // Добавляем предыдущие элементы
//     //                 lang: [
//     //                     {
//     //                         lang: tempLang,
//     //                         name: value
//     //                     },
//     //                 ],
//     //                 strTitle: value
//     //             })
//     //
//     //             // console.log("totalLang",totalLang)
//     //         }else{
//     //             setTotalLang({
//     //                 ...totalLang, // Добавляем предыдущие элементы
//     //                 lang: [
//     //                     {
//     //                         lang: tempLang,
//     //                         name: value
//     //                     },
//     //                 ],
//     //             })
//     //             // console.log("totalLang",totalLang)
//     //         }
//     //     }
//     //     // console.log("tempLang",tempLang)
//     //
//     // }
//
//
//     // const changeTextInput = (value) => {
//     //     setTextInput(value);
//     //
//     //     const language = languages.find((l) => l.name === lang);
//     //     if (language) {
//     //         const tempLang = language.code;
//     //
//     //         // Создаём новый объект для обновления состояния
//     //         const newLangObject = { lang: tempLang, name: value };
//     //
//     //         // Обновляем состояние, добавляя новый объект в массив
//     //         setTotalLang((prevTotalLang) => {
//     //             // Проверяем, существует ли уже объект с таким языковым кодом
//     //             const langExists = prevTotalLang.lang.some((item) => item.lang === tempLang);
//     //
//     //             if (langExists) {
//     //                 // Если объект существует, обновляем его
//     //                 return {
//     //                     ...prevTotalLang,
//     //                     lang: prevTotalLang.lang.map((item) =>
//     //                         item.lang === tempLang ? { ...item, name: value } : item
//     //                     ),
//     //                     // Обновляем strTitle только для основного языка
//     //                     strTitle: tempLang === langDev ? value : prevTotalLang.strTitle,
//     //                 };
//     //             } else {
//     //                 // Если объекта нет, добавляем новый
//     //                 return {
//     //                     ...prevTotalLang,
//     //                     lang: [...prevTotalLang.lang, newLangObject],
//     //                     // Обновляем strTitle только для основного языка
//     //                     strTitle: tempLang === langDev ? value : prevTotalLang.strTitle,
//     //                 };
//     //             }
//     //         });
//     //     }
//     // };
//
//     useEffect(() => {
//         console.log("update langEn",langEn)
//         console.log("update langRu",langRu)
//         console.log("update langEs",langEs)
//         console.log("update langIt",langIt)
//         console.log("update langUa",langUa)
//
//     },[langEn, langRu,langEs,langIt,langUa])
//
//     const changeTextInput = (value) => {
//         setTextInput(value);
//         // console.log("value",value)
//         // console.log("languages",languages)
//         // console.log("lang",lang)
//         // console.log("langDev",langDev)
//
//         // Фильтрация по совпадению кодов
//         // Найти код языка по имени
//         const code = languages.find(l => l.name === lang)?.code;
//
//         switch (code) {
//             case "en":
//                 setLangEn({lang: "en", name: value})
//                 break;
//             case "ru":
//                 setLangRu({lang: "ru", name: value})
//                 break;
//             case "es":
//                 setLangEs({lang: "es", name: value})
//                 break;
//             case "it":
//                 setLangIt({lang: "it", name: value})
//                 break;
//             case "ua":
//                 setLangUa({lang: "ua", name: value})
//                 break;
//
//         }
//
//     }
//
//
//     // console.log("totalLang", totalLang)
//
//     return (
//         <TextInput
//             value={textInput}
//             onChangeText={(value) => changeTextInput(value)}
//             style={styleInput}
//             placeholder="Enter new recipe name"
//             placeholderTextColor='grey'
//         />
//     )
// }

export default InputCustomComponent;
