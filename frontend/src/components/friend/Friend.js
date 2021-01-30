import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, ImageBackground, Modal } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import _ from 'lodash';

import styles from './style';
import background from '../../assets/images/background.png';
import backIcon from '../../assets/images/backIcon.png';
import cameraImg from '../../assets/images/camera.png';
import removeUserIcon from '../../assets/images/removeUser.png';
import addUserIcon from '../../assets/images/addUser.png';

const API_URL = "http://54.252.181.63";


export default function Friend({ route, navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const friendName = route.params.friendName;
  const [allGroups, setAllGroups] = useState([]);
  const [commonGroups, setCommonGroups] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if(isFocused){
      fetchCommonGroups()
    }
  }, [isFocused]);

  async function fetchCommonGroups() {
    const url = `${API_URL}/groups`;
    const fetchOptions = {
      method: 'GET',
      headers:{
      'Accept': 'application/json',
      'Content-Type':'application/json'
      }
    };

    await fetch(url, fetchOptions)
      .then((response) => response.json())
      .then((json) => {setAllGroups(json.filter((group) => group.user_ids.includes(friendName) && group.user_ids.includes(global.username)))})
      .catch((error) => console.error(error))
  }
  
  function removeFriend() {
    fetch(`${API_URL}/user/` + global.username+ '/friend_remove?friend_id=' + friendName, {
      method: 'DELETE',
    }).then((response) => response.json())
    setModalVisible(false);
    navigation.navigate('FriendsNav');
  }

  function _renderItem({item}) {
    return(
      <View style={[styles.listComponent, {margin: 10}]}>
        <TouchableOpacity style={{backgroundColor: '#0d459e80', borderRadius: 15, padding: 10, width: 200}} onPress={() => {global.redirectGroup = item.id;
                                  navigation.navigate('Groups');
                                }}>
          <Text style={{color: 'white', fontWeight: 'bold', textAlign: 'center'}}> {item.id} </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ImageBackground source={background} style={styles.container}>
      <Modal style = {styles.modal} transparent={true} visible={modalVisible}>
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible(false)}>
            <Image source={backIcon} style={styles.backImage} />
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}> Remove {friendName} from your friends list?</Text>
            <View style={[styles.buttonContainer], {flexDirection: "row"}}>
              <TouchableOpacity style={styles.modalButton} onPress={removeFriend}>
                <Text style={styles.buttonText}> Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}> No </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>                 
      </Modal>
      <Image source={cameraImg} style={styles.image} />
      <Text style={styles.groupTitle}> {friendName} </Text>
      <View style = {styles.searchContainer}>
        <TouchableOpacity style={styles.friendButton} onPress={() => setModalVisible(true)}>
          <Image source={removeUserIcon} style={styles.image} />
          <Text style={styles.buttonText}> Remove Friend </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.friendButton} onPress={() => navigation.push('AddFriendToGroup', {friendName: friendName})}>
          <Image source={addUserIcon} style={styles.image} />   
          <Text style={styles.buttonText}> Add to group</Text>
        </TouchableOpacity>      
      </View>
        
      <View style ={[styles.listGroups]}>
      <Text style={[styles.listGroupsHeader, {}]}>Mutual Groups</Text>
        <FlatList contentContainerStyle={{alignItems: 'center'}} data={allGroups} keyExtractor={item => item.id} renderItem={_renderItem}></FlatList>
      </View>
    </ImageBackground>
  );
}