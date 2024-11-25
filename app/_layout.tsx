import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import "../global.css";


export default function RootLayout() {


  return (
      <Stack>

        <Stack.Screen name="index" options={{headerShown:false}} />
        <Stack.Screen name="homeScreen" options={{headerShown:false}} />
        <Stack.Screen name="RecipeDetailsScreen" options={{headerShown:false}} />
        <Stack.Screen name="ProfileScreen" options={{headerShown:false}} />
        <Stack.Screen name="ChangeLangScreen" options={{headerShown:false, presentation: "modal",}} />
      </Stack>

  );
}
