import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SelectCustom from "./SelectCustom";

const LanguagesWrapper = ({setLang,lang}) => {

    // setLang={setLang} lang={lang}
    // Список языков с их названиями
    const languageNames = {
        En: 'English',
        Ru: 'Русский',
        It: 'Italiano',
        Ua: 'Українська',
        Es: 'Español',
    };
    // const languagesKey = Object.keys(languageNames); // Массив ключей (кодов языков)
    // const languagesValues = Object.values(languageNames); // Массив ключей (кодов языков)

  return (
    <SelectCustom title={'Language App:'} items={languageNames} defaultValue={lang} setItems={setLang} />
  );
};

const styles = StyleSheet.create({})

export default LanguagesWrapper;
