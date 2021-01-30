import React, { useState, useEffect, useContext } from "react";
import { Component } from "react";
import { View, Text, TouchableOpacity, ImageBackground, Modal, FlatList, Image, TextInput, Dimensions, ActivityIndicator } from "react-native";
import { navbarOptions } from '../Nav/NavbarOptions';
import { CheckBox } from 'react-native-elements'
import { createStackNavigator } from '@react-navigation/stack';
import { FloatingAction } from "react-native-floating-action";
import { useIsFocused } from "@react-navigation/native";

import styles from './style';
import background from '../../assets/images/background.png';
import friendImg from '../../assets/images/friendPic.png';
import rightDownArrow from '../../assets/images/rightDownArrow.png';

import NewFriend from '../NewFriend/NewFriend';
import Friend from "../friend/Friend";
import AddFriendToGroup from "../AddFriendToGroup/AddFriendToGroup";

const screen = Dimensions.get("window");
const Stack = createStackNavigator();


export default function Friends( {route, navigation} ){ 
  return (
    <Stack.Navigator initialRouteName="FriendsNav" screenOptions={navbarOptions({navigation})}>     
      <Stack.Screen name="FriendsNav" component={FriendsScreen} options={{ title: "Friends" }}/>
      <Stack.Screen name="NewFriend" component={NewFriend} options={{ title: "Add new friend" }}/>
      <Stack.Screen name="FriendScreen" component={Friend} options={{ title: "Friend" }}/>
      <Stack.Screen name="AddFriendToGroup" component={AddFriendToGroup} options={{ title: "Add friend to group" }}/>
    </Stack.Navigator>   
  );
}

export function FriendsScreen( {route, navigation}){
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [modal1, setModal1] = useState(global.introPhase == 6);
  const [modal2, setModal2] = useState(global.introPhase == 7);
  const [alphaChecked, setAlphaChecked] = useState(false);
  const [filterMode, setFilterMode] = useState("");
  const [revAlphaChecked, setRevAlphaChecked] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [filterModal, setFilterModal] = useState(false);
  const isFocused = useIsFocused();


  function handleNewFriendButton() {
    navigation.push('NewFriend');
    fetchRequest();
  }

  function fetchRequest() {
    const url = 'http://54.252.181.63/user/' + global.username;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {setData(json.friend_ids)
                      setFiltered(json.friend_ids)})
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }

  function handleFriendPress(name) {
    navigation.push('FriendScreen', {friendName: name});
  }

  function removeFriend() {
    setModalVisible(false);
  }

  useEffect(() => {
    if (isFocused){
      fetchRequest()
    }
    if(global.introPhase == 6){
      setModal1(true);
    }
  
  }, [isFocused]);

  const _renderItem = ({ item }) => (
    <TouchableOpacity style={styles.button} name={item} onPress={() => handleFriendPress(item)} >
      <Image source={friendImg} style={styles.imageSmall} />
      <Text style={styles.buttonText}> {item} </Text>
    </TouchableOpacity>
  );

  function changeFilter() {
    if (filterMode == 'alphabetical') {
      var temp = data;
      setData(temp.sort(function (a, b) {
        return a.localeCompare(b); //using String.prototype.localCompare()
      }));
    } else if (filterMode == 'revalphabetical') {
      var temp = data;
      temp = temp.sort(function (a, b) {
        return a.localeCompare(b); //using String.prototype.localCompare()
      });
      setData(temp.reverse());
    }
  }

  const renderModal1 = () => {
    function closeModal(){
      setModal1(false);
      global.introPhase = -1;
    }
    function nextModal(){
      setModal1(false);
      setModal2(true);
      global.introPhase = 7;
    }

    return (
    <Modal transparent={true} visible={modal1}>
      <View style={styles.introModalContainer}>
        <View style={styles.modalBox} opacity={0.99}>
          <Text style={[styles.modalText, {paddingTop: 10}]}> This is the Friends screen, where you can add/remove friends, as well as add them to groups</Text>
          <Text style={[styles.modalText, {paddingTop: 10}]}> Before you get started, here are a few tips</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', paddingTop:20}}>
              <TouchableOpacity style={styles.modalButton2} onPress={() => nextModal()}>
                <Text> Next </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton2} onPress={() => closeModal()}>
                <Text> Exit </Text>
              </TouchableOpacity>
          </View>
        </View>
      </View>   
    </Modal>
    )
  }

  const renderModal2 = () => {
    function closeModal(){
      setModal2(false);
      setModal1(true);
    }
    function nextModal(){
      global.introPhase == -1
      setModal2(false)
      navigation.navigate('Home');
    }

    return (
      <Modal transparent={true} visible={modal2}>
        <View style={styles.introModalContainer2}>
          <View style={[styles.modalBox, {flex: 1}]} opacity={0.99}>
            <Text style={[styles.modalText, {paddingTop: 10}]}>You can access the friends tab using the bottom tab navigator</Text>
            <Text style={[styles.modalText, {paddingTop: 10}]}>If you tap once on any bottom tab, it will take you to wherever you last left off, to return to the tab base page, tap the icon again</Text>
            <Text style={[styles.modalText, {paddingTop: 10}]}>You can redo this tutorial again through the settings menu in the top right of the screen</Text>

            <View style={{flexDirection: 'row', alignItems: 'center', paddingTop:20}}>
              <TouchableOpacity style={styles.modalButton2} onPress={() => nextModal()}>
                <Text> Finish </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton2} onPress={() => closeModal()}>
                <Text> Back </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.leftArrow}>
              <Image source={rightDownArrow} style={styles.imageSmall} />
            </View>
          </View>
        </View>   
      </Modal>
    )
  }

  const renderFilterModal = () => {
    return (
    <Modal transparent={true} visible={filterModal}>
      <View style={styles.introModalContainer}>
        <View style={styles.modalBox} opacity={0.99}>
        <Text style={{fontWeight: 'bold', paddingBottom: 20, fontSize: 20}}>Sort Groups</Text>
        <CheckBox
          center
          title='Alphabetical'
          checkedIcon='dot-circle-o'
          uncheckedIcon='circle-o'
          checked={alphaChecked}
          onPress={() => {setAlphaChecked(!alphaChecked);
                          setFilterMode('alphabetical');
                          setRevAlphaChecked(false); }}
        />
        <CheckBox
          center
          title='Reverse-Alphabetical'
          checkedIcon='dot-circle-o'
          uncheckedIcon='circle-o'
          checked={revAlphaChecked}
          onPress={() => {setRevAlphaChecked(!revAlphaChecked);
                          setFilterMode('revalphabetical');
                          setAlphaChecked(false); }}
        />
          <View style={{flexDirection: 'row', alignItems: 'center', paddingTop:20}}>
              <TouchableOpacity style={styles.modalButton} onPress={() => {setFilterModal(false);
                                                                            changeFilter();}}>
                <Text> Exit </Text>
              </TouchableOpacity>
          </View>
        </View>
      </View>   
    </Modal>
    )
  }

  const renderFilter = () => {  
    return (
    <View style={styles.filterButtonContainer}>
      <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModal(true)}>
        <Image style= {{width: 30, height: 30,}}source={require('../../assets/images/filter.png')} />
      </TouchableOpacity>
    </View>
    )
  }

  function searchFunction(text) {
    if (text == ''){
      setFiltered(data);
    } else{
      const result = data;
      setFiltered(result.filter(word => word.toLowerCase().includes(text.toLowerCase())));
    }
  }

  const renderSearchBar = () => {
    return(
      <View style={styles.searchBarContainer}>
        <View style={styles.search}>
          <TextInput
              placeholder='Search'
              textStyle={{ color: '#000' }}
              maxLength={40}
              style={styles.searchText}
              onChangeText={text => searchFunction(text)}
              defaultValue=''
              
          />
        </View>
      </View>
    )
  }

  const renderSearchAndFilter = () => {
    return(
      <View style={{paddingBottom: 10, paddingTop: 10,}}>
        <View style={{flexDirection: 'row', height: 40}}>
          {renderSearchBar()}
          {renderFilter()}
        </View>
      </View> )
  }

  const renderAddButton = () => {
    return(
      <TouchableOpacity onPress={() => handleNewFriendButton()}>
        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 45,
          }}
        >
          <Image source={require('../../assets/images/plusIcon.png')} style={{width: 70, height: 70}} />
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <ImageBackground source={background} style={[ {flex: 1}, styles.container ]}>  
      {renderModal1()}
      {renderModal2()}
      {renderFilterModal()}
      <View style={styles.buttonContainer}>
        <View style={{zIndex: 0}}>
          { !isLoading && data.length !== 0 && renderSearchAndFilter() }
          { !isLoading && data.length ?
          <FlatList  contentContainerStyle={{flexGrow: 1}} numColumns={1} data={filtered} keyExtractor={item => item} renderItem={_renderItem}></FlatList>
          :
          !isLoading && !data.length && 
            <Text style={styles.emptyText}>You haven't added any friends yet! Press the bottom right icon to get adding!</Text>
          }
        </View>
      { isLoading && <View style={{alignItems: 'center', justifyContent: 'center',flex: 1}}><ActivityIndicator size={'large'} color={'white'}/></View>}
      </View>  
      
      <View style={styles.floatinBtn}>
        {renderAddButton()}
      </View>

    </ImageBackground>
  );
}