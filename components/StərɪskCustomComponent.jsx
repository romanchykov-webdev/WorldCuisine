import { Text, View } from 'react-native'
import { useAuth } from '../contexts/AuthContext'

function StərɪskCustomComponent({ size = 30, color = 'red', top = 0, left, right = 0 }) {
  // const auth = useAuth();
  const { requiredFields } = useAuth()
  // console.log("Full auth context in StərɪskCustomComponent:", auth);
  // const { requiredFields } = auth;
  // console.log("StərɪskCustomComponent requiredFields ", requiredFields);
  // console.log("StərɪskCustomComponent requiredFields ", requiredFields);

  return (
    <>
      {requiredFields && (
        <View
          style={{
            position: 'absolute',
            top,
            left,
            right,
            width: size,
            height: size,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: size, color, textAlign: 'center' }}>*</Text>
        </View>
      )}
    </>
  )
}

export default StərɪskCustomComponent
