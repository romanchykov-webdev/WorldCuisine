import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SelectCustom from "./SelectCustom";

const ThemeWrapper = ({theme, setTheme}) => {
    {/*theme, setTheme*/}
    // items, defaultValue, setItems

    const themesValue={
        Auto:'Auto',
        Dark:'Dark',
        Light:'Light',
    }

  return (
    <SelectCustom title={'Theme App: '} items={themesValue} defaultValue={theme} setItems={setTheme}/>

    // <SelectCustom title={'Change language:'} items={languageNames} defaultValue={lang} setItems={setLang} />
  );
};

const styles = StyleSheet.create({})

export default ThemeWrapper;
