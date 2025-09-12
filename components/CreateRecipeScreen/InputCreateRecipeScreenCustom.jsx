// components/CreateRecipeScreen/InputCreateRecipeScreenCustom.jsx
import React from 'react'
import { View, Text } from 'react-native'
import i18n from '../../lang/i18n'
import { useDebounce } from '../../utils/useDebounce'
import InputComponent from '../InputComponent'

export default function InputCreateRecipeScreenCustom({
  langs = [],
  value = {},
  onChange,
  label = i18n.t('Country of origin of the recipe'),
  placeholder = i18n.t('Write the name of the country'),
  styleTextDesc,
  styleInput,
}) {
  const [local, setLocal] = React.useState({ ...value })
  // console.log('langs', langs)
  // Подхватываем внешние правки только если реально изменились
  React.useEffect(() => {
    const cur = JSON.stringify(local || {})
    const inc = JSON.stringify(value || {})
    if (cur !== inc) setLocal(value || {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value)])

  const debounced = useDebounce(local, 300)
  React.useEffect(() => {
    if (!onChange) return
    const prev = JSON.stringify(value || {})
    const next = JSON.stringify(debounced || {})
    if (prev !== next) onChange(debounced)
  }, [debounced, onChange, value])

  const update = (code, text) => {
    setLocal((p) => ({ ...p, [code]: text }))
  }

  return (
    <View>
      {!!label && (
        <Text
          style={[
            { fontSize: 16, fontWeight: 'bold', marginBottom: 6, paddingLeft: 5 },
            styleTextDesc,
          ]}
        >
          {label}
        </Text>
      )}

      {langs.map((code) => (
        <View key={code} style={{ marginBottom: 12 }}>
          <InputComponent
            label={`${placeholder} (${code})`}
            placeholder={`${placeholder} ${code.toUpperCase()}`}
            value={local[code] ?? ''}
            onChangeText={(t) => update(code, t)}
            inputStyle={styleInput}
            returnKeyType="done"
          />
        </View>
      ))}
    </View>
  )
}
