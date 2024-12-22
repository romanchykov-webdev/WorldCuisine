import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SelectCustom from "./SelectCustom";
import {CogIcon} from "react-native-heroicons/outline";

// translate
import i18n from '../lang/i18n'

const ThemeWrapper = ({theme, setTheme}) => {
    {/*theme, setTheme*/}
    // items, defaultValue, setItems

    const themesValue={
        auto:'Auto',
        dark:'Dark',
        light:'Light',
    }

  return (
    <SelectCustom title={i18n.t('Theme App:')} items={themesValue} defaultValue={theme} setItems={setTheme} icon={CogIcon}/>

    // <SelectCustom title={'Change language:'} items={languageNames} defaultValue={lang} setItems={setLang} />
  );
};

const styles = StyleSheet.create({})

export default ThemeWrapper;
