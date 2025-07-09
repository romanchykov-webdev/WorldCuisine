import { registerRootComponent } from 'expo'
import { ExpoRoot } from 'expo-router'
import { AppRegistry } from 'react-native'

function Root() {
  console.log('Root component rendered')
  return <ExpoRoot context={require.context('./app')} />
}

AppRegistry.registerComponent('main', () => Root)
registerRootComponent(Root)
