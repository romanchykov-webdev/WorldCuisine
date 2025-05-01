import React from "react";
import { StyleSheet } from "react-native";
import { LanguageIcon } from "react-native-heroicons/outline";
import SelectCustom from "./SelectCustom";

// translate
import i18n from "../lang/i18n";

const LanguagesWrapper = ({ setLang, lang }) => {
	// setLang={setLang} lang={lang}
	// console.log('LanguagesWrapper lang',lang)
	// Список языков с их названиями
	const languageNames = {
		en: "English",
		ru: "Русский",
		it: "Italiano",
		ua: "Українська",
		es: "Español",
	};
	// const languagesKey = Object.keys(languageNames); // Массив ключей (кодов языков)
	// const languagesValues = Object.values(languageNames); // Массив ключей (кодов языков)

	return (
		<SelectCustom
			title={i18n.t("Language App:")}
			items={languageNames}
			defaultValue={lang}
			icon={LanguageIcon}
			// setItems={setLang}
			setItems={(selectedLang) => {
				// console.log('LanguagesWrapper selectedLang',selectedLang)
				setLang(selectedLang);
				i18n.locale = selectedLang; // Обновляем i18n.locale
			}}
			// setItems={(selectedLang) => {
			// 	if (selectedLang && typeof selectedLang === "string") {
			// 		setLang(selectedLang);
			// 		i18n.locale = selectedLang;
			// 	} else {
			// 		console.warn("Invalid language selected:", selectedLang);
			// 		// Optionally set a fallback language
			// 		setLang("en");
			// 		i18n.locale = "en";
			// 	}
			// }}
		/>
	);
};

const styles = StyleSheet.create({});

export default LanguagesWrapper;
