import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import Toast from 'react-native-simple-toast';

import styles from './style';
import background from '../../assets/images/background.png';
import logo from '../../assets/images/logo.png';

const API_URL = 'http://54.252.181.63/';


export default function Login({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [triedLogin, setTriedLogin] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTriedLogin(false);
  }, [username, password]);

  const onSubmitLogin = () => {
    if (!username || !password) {
      return;
    }
    setLoading(true);
    fetchRequest();
  };

  // fetch user data from API for authentication
  const fetchRequest = () => {
    fetch(`${API_URL}/user/${username}`)
      .then(response => response.json())
      .then(userData => {
        if (!userData.hasOwnProperty('message') && password === userData.password) {
          setAuthenticated(true);
          global.username=username;
          global.introPhase = -1;
          navigation.replace('Nav');
          Toast.show("Login successful");     
          setLoading(false);
        }
        else {
          setTriedLogin(true);
          setAuthenticated(false);
          setLoading(false);
        }
      })
      .catch(error => console.error(error));
  }

  const renderInvalidLogin = () => {
    return (
      <View style={styles.invalidLoginBox}>
        <Text style={styles.invalidLogin}>Account does not exist or the incorrect password was entered.</Text>
      </View>
    );
  };

  const renderUsername = () => {
      return (
          <View style={{ marginTop: 20 }}>
              <Text style={styles.label}>Username</Text>
              <TextInput style={styles.textInput} onChangeText={text => setUsername(text)} value={username} />
          </View>
      ); 
  };

  const renderPassword = () => {
    return (
      <View style={{ marginTop: 20 }}>
        <Text style={styles.label}>Password</Text>
        <TextInput secureTextEntry={true} style={styles.textInput} onChangeText={text => setPassword(text)} value={password} />
      </View>
    ); 
  };

  const renderLoadingScreen = () => {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <ActivityIndicator color="#ffffff" size="large" />
      </View>
    );
  }; 

  return (
    <ImageBackground source={background} style={[ styles.background, styles.container ]}>
      <KeyboardAvoidingView behavior={"height"}>
      <Image source={logo} style={styles.logo}/>
      </KeyboardAvoidingView>
        {triedLogin && !authenticated && renderInvalidLogin()}
        {renderUsername()}
        {renderPassword()}
      
      { loading ? 
        <ActivityIndicator color="#ffffff" size="large"></ActivityIndicator>
        :
        <TouchableOpacity style={styles.loginButton} onPress={() => onSubmitLogin()}>
          <Text style={{ color: 'white', fontSize: 20 }}>Log In</Text>
        </TouchableOpacity>
      }
      
      <Text style={styles.signUpText} onPress={() => navigation.replace('SignUp')}>Don't have an account? Sign up</Text>
    </ImageBackground>
  );
}