import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Modal, ImageBackground } from "react-native";
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navbarOptions } from '../Nav/NavbarOptions';

import styles from './style';
import background from '../../assets/images/background.png';

import Groups from '../groups/Groups';
import Decks from '../decks/Decks';
import Friends from '../friends/Friends';

//Home screen needs access to decks, groups and friends
const Stack = createStackNavigator();


export default function Home ({navigation}){
  return(
    <Stack.Navigator initialRouteName="Home" screenOptions={navbarOptions({navigation}, "")}>
      <Stack.Screen name="Home" component={HomeScreen}/>
    </Stack.Navigator>
  )
}


export function HomeScreen ( {route, navigation} ){
  const [modalVisible, setModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(1);
  const [modal1, setModal1] = useState(global.introPhase == 0);
  const [modal2, setModal2] = useState(global.introPhase == 1);
  const [modal3, setModal3] = useState(global.introPhase == 2);
  const isFocused = useIsFocused()


  useEffect(() => {
    if (isFocused){
      if(global.introPhase == 0){
        setModal1(true);
      }
    }
  
  }, [isFocused]);

  const renderModal1 = () => {
    function closeModal() {
      setModal1(false);
      global.introPhase = -1;
    }

    function nextModal() {
      setModal1(false);
      setModal2(true);
      global.introPhase = 1;
    }

    return (
    <Modal transparent={true} visible={modal1}>
      <View style={styles.introModalContainer}>
        <View style={styles.modalBox} opacity={0.99}>
          <Text style={styles.modalText}> Hey there {global.username} ! </Text>
          <Text style={[styles.modalText, {paddingTop: 10}]}> We noticed this is your first time logging in, would you like a short introduction to Pref'd?</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', paddingTop:20}}>
              <TouchableOpacity style={styles.modalButton} onPress={() => nextModal()}>
                <Text> Yes </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => closeModal()}>
                <Text> No </Text>
              </TouchableOpacity>
          </View>
        </View>
      </View>   
    </Modal>
    )
  }

  const renderModal2 = () => {
    function closeModal() {
      setModal2(false);
      setModal1(true);
    }

    function nextModal() {
      global.introPhase = 2;
      setModal2(false);
      setModal3(true);
    }

    return (
      <Modal transparent={true} visible={modal2}>
        <View style={styles.introModalContainer}>
          <View style={styles.modalBox} opacity={0.99}>
            <Text style={[styles.modalText, {paddingTop: 10}]}> This is the Home screen, here you can quickly navigate throughout the three main pages of the application, the Decks screen, Groups screen and Friends screen.</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', paddingTop:20}}>
                <TouchableOpacity style={styles.modalButton} onPress={() => nextModal()}>
                  <Text> Next </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => closeModal()}>
                  <Text> Back </Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>   
      </Modal>
    )
  }

  const renderModal3 = () => {
    function closeModal() {
      setModal3(false);
      setModal2(true);
    }

    function nextModal() {
      global.introPhase = 2;
      setModal3(false);
      navigation.navigate("Decks");
    }

    return (
    <Modal transparent={true} visible={modal3}>
      <View style={styles.introModalContainer2}>
        <View style={[styles.modalBox, {flex: 1}]} opacity={0.99}>
          <Text style={[styles.modalText, {paddingTop: 10}]}>You can always return to the Home screen through the bottom tab icon</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', paddingTop:20}}>
              <TouchableOpacity style={styles.modalButton} onPress={() => nextModal()}>
                <Text> Next </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => closeModal()}>
                <Text> Back </Text>
              </TouchableOpacity>
          </View>
          <View style={styles.leftArrow}>
            <Image source={require('../../assets/images/bottomArrow.png')} style={styles.imageSmall} />
          </View>
        </View>
      </View>   
    </Modal>
    )
  }

  return (
    <ImageBackground source={background} style={[ {flex: 1}, styles.container ]}>
      {renderModal1()}
      {renderModal2()}
      {renderModal3()}
      <Text style={styles.welcomeText}>
        Welcome, {global.username}
      </Text>
      <Text style={styles.subWelcomeText}>
        Where would you like to start?
      </Text>

      <TouchableOpacity style={[styles.button, {backgroundColor: '#E1EBFF'}]} onPress={() => navigation.navigate('Decks')}>
        <View style={styles.rowContainer}>
          <Text style={styles.headingText}> Decks </Text>
          <Image source={require('../../assets/images/deckImage.png')} style={styles.image} />
        </View>
        
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, {backgroundColor: '#FFECDB'}]} onPress={() => navigation.navigate('Groups')}>
      <View style={styles.rowContainer}>
          <Text style={styles.headingText}> Groups </Text>
          <Image source={require('../../assets/images/groupImage.png')} style={styles.image} />
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, {backgroundColor: '#FFE1E5'}]} onPress={() => navigation.navigate('Friends')}>
      <View style={styles.rowContainer}>
          <Text style={styles.headingText}> Friends </Text>
          <Image source={require('../../assets/images/friendsImage.png')} style={styles.image} />
        </View>
      </TouchableOpacity>
    </ImageBackground>
  );
}

