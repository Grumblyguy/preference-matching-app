import React, { useState, useEffect, component, Component } from "react";
import { View, ImageBackground, Text, TouchableOpacity, TextInput, Image, Picker, KeyboardAvoidingView, ToastAndroid } from "react-native";
import { navbarOptions } from "../Nav/NavbarOptions";
import { createStackNavigator } from "@react-navigation/stack";
import * as ImagePicker from "expo-image-picker";
import Toast from 'react-native-simple-toast';

import styles from "./style";
import background from '../../assets/images/background.png';
import cameraImg from '../../assets/images/camera.png';

import SendNotification from '../Nav/Notification.js';

const Stack = createStackNavigator();
const API_URL = "http://54.252.181.63";


export default function CreateDeck({ route, navigation }) {
  const [deckImage, setDeckImage] = useState("");
  const [title, setTitle] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [description, setDescription] = useState("");
  const [groups, setGroups] = useState([]);
  const [groupDecks, setGroupDecks] = useState([]);

  useEffect(() => {
    if(route.params != undefined && route.params.groupName != undefined){
      setSelectedGroup(route.params.groupName);
    }
    fetchGroups();
    getCameraPermissions();
  }, []);

  const getCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (status !== "granted") {
      Toast.show('Camera permissions denied, unable to access camera roll to upload an image.');
    }
  };

  const fetchGroups = async () => {
    const url = `${API_URL}/user/${global.username}`;
    const res = await fetch(url);
    const body = await res.json();
    setGroups(body.group_ids);
  };

  const fetchDeckNames = async () => {
    const url = `${API_URL}/group/${selectedGroup}`;
    const res = await fetch(url);
    const body = await res.json();
    setGroupDecks(body.decks);
  };

  const invalidTitle = () => {
    if (title == ""){
      Toast.show('Deck name must not be empty', Toast.TOP);
      return true;
    }

    const tempDecks = groupDecks.filter((deck) => deck.id == title);
    if (tempDecks.length != 0){
      Toast.show('Deck' + deck.id + ' already exists in group ' + deck.group);
      return true;
    }
    return false;
  }

  async function sendNotificationsOff(group, title){
    const url = `${API_URL}/group/${group}`;
    const fetchOptions = {
      method: 'GET',
      headers:{
        'Accept': 'application/json',
        'Content-Type':'application/json'
      }
    }

    await fetch(url, fetchOptions)
      .then((response) => response.json())
      .then((json) => {json.user_ids.map((userId) => 
        userId != global.username && SendNotification(userId, "Deck", title))})
      .catch((error) => console.error(error));
  }

  const onCreateDeck = () => {
    if(invalidTitle()){
      return;
    }
    
    if (!title || !selectedGroup) {
      return;
    }

    const url = `${API_URL}/group/${selectedGroup}/deck`;

    const postRequestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deck_id: title,
        description: description,
        owner_id: global.username,
        id: selectedGroup,
      }),
    };

    fetch(url, postRequestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.code) {
          sendNotificationsOff(selectedGroup, title);
          navigation.navigate("Decks");
          Toast.show('Deck created successfully', Toast.LONG, Toast.TOP);
        } else {
          Toast.show('Deck name already in use for selected group', Toast.LONG, Toast.TOP);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleAddSuggestion = () => {
    navigation.navigate("AddSuggestion");
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setDeckImage(result.uri);
    }
  };

  const renderChangeableImage = () => {
    return (
      <TouchableOpacity onPress={pickImage}>
        {!deckImage ? 
          (<Image source={cameraImg} style={{width: 100, height: 100, alignContent: "center", justifyContent: "center"}}/>)
            : 
          (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Image source={{ uri: deckImage }} style={{ width: 100, height: 100, borderRadius: 100 }}/>
            </View>
          )}
      </TouchableOpacity>
    );
  };

  const renderGroupSelect = () => {
    return (
      <View>
        <Text style={{paddingBottom: 10, fontWeight: 'bold', fontSize: 18 }}>Share to</Text>
        <Picker selectedValue={selectedGroup} style={styles.picker} onValueChange={(itemValue, itemIndex) => setSelectedGroup(itemValue)}>
          {groups.map((group) => (
            <Picker.Item label={group} key={group} value={group} />
          ))}
        </Picker>
      </View>
    );
  };

  const renderDescription = () => {
    return (
      <View>
        <Text style={{paddingBottom: 10, fontWeight: 'bold', paddingTop: 20, fontSize: 18 }}>Description</Text>
        <TextInput
          style={{ height: 80, borderColor: "gray", borderWidth: 1, borderRadius: 15, textAlignVertical: 'top', paddingTop: 10, paddingLeft: 10 }}
          onChangeText={(text) => setDescription(text)}
          value={description}
        />
      </View>
    );
  };

  const renderCreateDeckButton = () => {
    return (
      <View
        style={{marginTop: 50, alignItems: "center", justifyContent: "center"}}>
        <TouchableOpacity onPress={onCreateDeck} style={{ backgroundColor: "orange", padding: 10, borderRadius: 15 }}>
          <Text>Create deck</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ImageBackground source={background} style={styles.container }>
      <View style={styles.topHalf}>
        <Text style={{color: 'white', fontSize: 24, paddingBottom: 40}}>Create a Deck</Text>
        {renderChangeableImage()}
        <TextInput
          style={{ fontSize: 24, color: 'white', paddingTop: 15, paddingBottom: 15, textAlign: 'center' }}
          placeholder="Insert Deck Title"
          onChangeText={(text) => setTitle(text)}
        />
      </View>
      <View style={styles.bottomHalf}>

        {renderGroupSelect()}
        {renderDescription()}
        {renderCreateDeckButton()}

      </View>
    </ImageBackground>
  );
}
