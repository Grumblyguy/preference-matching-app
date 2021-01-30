import { registerRootComponent } from 'expo';
import React, { useState } from 'react';
import { Text, View, SafeAreaView, Font } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../login/Login';
import SignUp from '../sign-up/SignUp';
import Nav from '../Nav/Nav';

const Stack = createStackNavigator();


export default function App({ navigation }) {
  global.username = ""
  global.groupName = ""
  global.introPhase = 0;
  global.redirectGroup = "";
  global.finalResult = { };

  /*
  useEffect(async () => {
    await Font.loadAsync({
      'Ionicons': require('react-native-vector-icons/Fonts/Ionicons.ttf'),
    })
  }, []);
  */

  return (    
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen initialPage="Login" name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} /> 
        <Stack.Screen name="Nav" component={Nav} options={{ headerShown: false }} />         
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);

