import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import Home from '../home/Home';
import Groups from '../groups/Groups';
import Decks from '../decks/Decks';
import Friends from '../friends/Friends';

import styles from './style';

const TabNav = createBottomTabNavigator();


export default function Nav({ navigation }) {
  return (
    <TabNav.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({focused}) => {
        let iconName;
        let color;
        if (route.name === 'Decks') {
          iconName = 'ios-albums';
        } else if (route.name === 'Groups') {
          iconName = 'ios-people';
        } else if (route.name === 'Friends') {
          iconName = 'md-people';
        } else if (route.name === 'Home') {
          iconName = 'ios-home';
        }
        // You can return any component that you like here!
        return <Icon name={iconName} size={32} color={focused ? 'orange' : 'grey'} />;
      },
    })}
    >
      <TabNav.Screen name="Home" component={Home}/>
      <TabNav.Screen name="Decks" component={Decks} />
      <TabNav.Screen name="Groups" component={Groups} />
      <TabNav.Screen name="Friends" component={Friends} />
    </TabNav.Navigator>
  );
}

export const screenoptions = {headerTitle: " ", headerStyle: styles.headerStyle, headerRight: () => (
  <View style={styles.rowContainer}>
    <TouchableOpacity style={styles.settingsButton}>   
        <Image source={require('../../assets/images/bell.png')} style={styles.image} />          
    </TouchableOpacity>
    <TouchableOpacity style={styles.settingsButton}>
      <Image source={require('../../assets/images/settings.png')} style={styles.image} />
    </TouchableOpacity>
  </View>  
),
}



