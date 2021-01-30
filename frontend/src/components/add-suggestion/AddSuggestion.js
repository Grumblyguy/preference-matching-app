import React, { useState, useEffect, Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, Picker, ImageBackground } from "react-native";
import { navbarOptions } from '../Nav/NavbarOptions';
import { createStackNavigator } from '@react-navigation/stack';
import { FloatingAction } from "react-native-floating-action";
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-simple-toast';

import styles from './style';
import background from '../../assets/images/background.png';
import cameraImg from '../../assets/images/camera.png';

const Stack = createStackNavigator();
const API_URL = "http://54.252.181.63";


export default function AddSuggestion({ route, navigation }) {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const { deckId, groupId } = route.params;

  useEffect(() => {
    getCameraPermissions();
  }, []);

  const getCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (status !== 'granted') {
      Toast.show('Camera permissions denied, unable to access camera roll to upload an image.');
    }
  };

  const onSubmitSuggestion = () => {
    if (!title) {
      return;
    }

    const url = `${API_URL}/group/${groupId}/deck/${deckId}/card`;

    const postRequestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: title,
        description: description,
        did: deckId,
        gid: groupId,
      }),
    };

    fetch(url, postRequestOptions)
    .then((response) => response.json())
    .then((data) => {
      if (data.code) {
        navigation.navigate("Deck");
      }
    })
    .catch((error) => console.log(error));
  };
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <ImageBackground source={background} style={styles.container}>
      <View style={styles.imageContainer}>
        { (image !== '') ? 
          <View style={styles.uploadedImg}>
            <Image source={{ uri: image }} style={{width: 200, height: 200}} />
          </View>
        :
          <View style={styles.defaultImg}>
            <Image source={cameraImg} style={{width: 150, height: 150}} />
          </View>          
        }
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            { (!image !== '') ? 
              <Text style={{textAlign: 'center', justifyContent: 'center'}}>Pick an image from camera roll</Text>
              :
              <Text style={{textAlign: 'center', justifyContent: 'center'}}>Use a new image from camera roll</Text>
            }
          </TouchableOpacity>
        </View>
      </View>
        
      <View style={styles.inputContainer}>
        <Text style={[styles.title, {paddingLeft: 1}]}>Title</Text>
        <TextInput style={styles.titleInput} onChangeText={text => setTitle(text)} />
      </View>
      
      <View style={styles.description}>
        <Text style={styles.title}>Description</Text>
        <TextInput
          style={styles.descriptionInput}
          onChangeText={text => setDescription(text)}
          value={description}
          placeholder={'(optional)'}
        />
      </View>
      <View style={{alignItems: 'center'}}>
          <TouchableOpacity onPress={onSubmitSuggestion} style={styles.submitButton}>
            <Text>Add suggestion to deck</Text>
          </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}