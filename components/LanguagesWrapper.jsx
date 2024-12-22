import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SelectCustom from "./SelectCustom";
import {LanguageIcon} from "react-native-heroicons/outline";

// translate
import i18n from '../lang/i18n'

const LanguagesWrapper = ({setLang,lang}) => {

    // setLang={setLang} lang={lang}
    // console.log('LanguagesWrapper lang',lang)
    // Список языков с их названиями
    const languageNames = {
        en: 'English',
        ru: 'Русский',
        it: 'Italiano',
        ua: 'Українська',
        es: 'Español',
    };
    // const languagesKey = Object.keys(languageNames); // Массив ключей (кодов языков)
    // const languagesValues = Object.values(languageNames); // Массив ключей (кодов языков)

  return (
    <SelectCustom title={i18n.t('Language App:')} items={languageNames} defaultValue={lang} icon={LanguageIcon}
                  // setItems={setLang}
                  setItems={(selectedLang) => {
                      console.log('LanguagesWrapper selectedLang',selectedLang)
                      setLang(selectedLang);
                      i18n.locale = selectedLang; // Обновляем i18n.locale
                  }}
    />
  );
};

const styles = StyleSheet.create({})

export default LanguagesWrapper;
