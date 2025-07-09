import { TextInput, View } from 'react-native'
import { hp } from '../constants/responsiveScreen'
import { themes } from '../constants/themes'
import { useAuth } from '../contexts/AuthContext'
// envelope-open

function InputComponent({
  icon,
  placeholder,
  value,
  onChangeText,
  containerStyle,
  secureTextEntry = false,
  email = false,
  ...props
}) {
  // console.log('props', props);
  const { currentTheme } = useAuth()
  // const { icon, placeholder, value, onChangeText,containerStyle, secureTextEntry = false, email=false}=props

  return (
    <View
      className="flex-row items-center rounded-2xl border-[1px]
        border-neutral-700 gap-2 px-5 mb-5
        {/*bg-red-500*/}
        "
      style={containerStyle}
    >
      {icon && icon}

      <TextInput
        style={{ fontSize: hp(2), color: themes[currentTheme]?.textColor }}
        className="flex-1 p-5"
        placeholder={placeholder}
        placeholderTextColor="grey"
        value={value}
        onChangeText={onChangeText}
        autoCorrect={false} // Отключает автозамены
        autoCapitalize="none" // Отключает автоматическую капитализацию
        autoCompleteType="off" // Отключает автозаполнение
        textContentType="none" // Для iOS
        keyboardType={email ? 'email-address' : 'default'}
        secureTextEntry={secureTextEntry} // Для пароля
        {...props}
      />
    </View>
  )
}

export default InputComponent
