import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ImageBackground, ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import * as ImagePicker from "expo-image-picker";
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

import styles from "./style";
import background from '../../assets/images/background.png';
import cameraImg from '../../assets/images/camera.png';
import pressPlayImg from '../../assets/images/pressplay.png';
import listImg from '../../assets/images/list.png';
import lightbulbImg from '../../assets/images/lightbulb.png';

import SendNotification from '../Nav/Notification.js';

const Stack = createStackNavigator();
const API_URL = "http://54.252.181.63";


export default function Deck({ route, navigation }) {
  const [deckImage, setDeckImage] = useState("");
  const [deck, setDeck] = useState({});
  const [votingStatus, setVotingStatus] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();

  const group = route.params.deck.group_id;
  
  useEffect(() => {
    if (isFocused){
      setIsLoading(true);
      fetchDeck();
    }
  }, [isFocused]);
  
  const fetchDeck = async () => {
    const passedDeck = route.params.deck;

    const getRequestOptions = {
      method: 'GET',
      headers: { "Content-Type": "application/json" }
    }

    // get decks using group id and then filter to get deck
    const url = `${API_URL}/group/${group}`;
    const response = await fetch(url, getRequestOptions);
    const body = await response.json();
    const decks = body.decks; 

    const updatedDeck = decks.find(deck => (deck.id === passedDeck.id && deck.description === passedDeck.description));
    setDeck(updatedDeck);

    const _votingStatus = determineVotingStatus(updatedDeck);
    updateUserVoteStatus(updatedDeck);
    setVotingStatus(_votingStatus);
    setIsLoading(false);
  };

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
        userId != global.username && SendNotification(userId, "DeckVote", title))})
      .catch((error) => console.error(error));
  }

  const updateUserVoteStatus = (_deck) => {
    const usersVoted = convertStringToArray(_deck.voted_ids);

    // check if user has voted
    if (usersVoted.includes(global.username)) {
      setHasVoted(true);
      return;
    }

    setHasVoted(false);
    return;
  }

  const onStartVoting = () => {
    fetchDeck();
    if (deck.cards.length < 2) {
      return;
    }

    const updatedDeck = { ...deck, voting_started: true };
    sendNotificationsOff(group, deck.id);

    // post a vote
    const url = `${API_URL}/group/${group}/deck/${deck.id}/start_vote`;

    const postRequestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        did: deck.id,
        gid: group,
      }),
    };

    fetch(url, postRequestOptions)
      .then(response => {
        return response.json();
      })
      .then(data => {
        setDeck((prevDeck) => ({ ...prevDeck, voting_started: true }));
        setVotingStatus("started");
      })
      .catch(error => console.log(error));
  };

  const handleViewSuggestions = () => {
    navigation.navigate('ViewSuggestions', { deckId: deck.id, groupId: group });
  };

  const handleAddSuggestion = () => {
    navigation.navigate('AddSuggestion', { deckId: deck.id, groupId: group });
  };

  const handleVoteNow = () => {
    navigation.navigate('Voting', { deckId: deck.id, groupId: group});
  };

  const handleViewResults = () => {
    navigation.navigate('FinalResult', { deckId: deck.id, groupId: group });
  }

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
        {!deckImage ? (
          <Image
            source={cameraImg}
            style={{width: 100, height: 100, alignContent: "center", justifyContent: "center"}}/>
          ) : (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Image
                source={{ uri: deckImage }}
                style={{ width: 100, height: 100, borderRadius: 100 }}
              />
            </View>
          )}
      </TouchableOpacity>
    );
  };

  const convertStringToArray = (stringToConvert) => {
    // if no ids in string (eg. stringToConvert is []), then return empty array
    if (stringToConvert === '[]') {
      return [];
    }

    const regex = new RegExp('\\[|\'|\\]| ', 'gi');
    const filteredString = stringToConvert.replace(regex, '');
    const arr = filteredString.split(',');
    return arr;
  }

  const determineVotingStatus = (_deck) => {
    const users = convertStringToArray(_deck.user_ids);
    const usersVoted = convertStringToArray(_deck.voted_ids);

    if (_deck.voting_started) {
      // it is completed, return completed
      if (usersVoted.length === users.length) {
        return 'completed';
      }
      else {
        // if not completed, return started
        return 'started';
      }
    } 
    else {
      return 'notStarted';
    }
  }

  const renderVotingStatus = () => {
    switch (votingStatus) {
      case 'started':
        return <Text style={{color: 'green', fontWeight: 'bold'}}>Started</Text>;
        break;
      case 'notStarted':
        return <Text style={{color:'red', fontWeight: 'bold'}}>Not started</Text>;
        break;
      case 'completed':
        return <Text style={{color:'grey', fontWeight: 'bold'}}>Completed</Text>;
        break;
      default:
        return <Text>-</Text>
        break;
    }
  }

  const renderLoadingScreen = () => {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <ActivityIndicator color="#ffffff" size="large" />
      </View>
    );
  }; 
  
  return (
    <ImageBackground source={background} style={styles.container}>
      { isLoading && renderLoadingScreen() }
      { !isLoading && Object.keys(deck).length > 0 &&
        <View style={styles.container}> 
          {renderChangeableImage()}
          <Text style={styles.groupTitle}> {deck.id} </Text>
          <Text style={styles.groupTitleSmall}> {deck.description} </Text>
          <View style={styles.descriptionBox}>
            <View style={{flexDirection:'row'}}>
              <Text style={{color: 'white'}}>Voting Status: </Text>
              {renderVotingStatus()}         
            </View>     
            <View style={styles.groupOptions}>
              <View style={{paddingRight: 15}}><Text style={{color: 'white'}}> Group: {group} </Text></View>
            </View>
          </View>
            <View style = {styles.searchContainer}>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableOpacity onPress={handleViewSuggestions} style={styles.rowButton}>
                  <Image source={listImg} style={{width: 70, height: 70}} />
                  <Text style={{paddingTop: 10}}>View suggestions</Text>
                </TouchableOpacity>

                { !deck.voting_started ? 
                  <TouchableOpacity onPress={handleAddSuggestion} style={styles.rowButton}>
                    <Image source={lightbulbImg} style={{width: 70, height: 70}} />
                    <Text style={{paddingTop: 10}}>Add suggestion</Text>
                  </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => Toast.show("You cannot add suggestions while the vote is in progress!")} style={[styles.rowButton, {backgroundColor: '#c9c9c980'}]}>
                    <Image source={lightbulbImg} style={{width: 70, height: 70}} />
                    <Text style={{paddingTop: 10, color: 'grey'}}>Add suggestion</Text>
                  </TouchableOpacity>
                }
              </View>
              <View style={{paddingTop: 10,}}>
                { (global.username === deck.owner) && (!deck.voting_started) && (deck.cards.length) >=2 && 
                  <TouchableOpacity onPress={onStartVoting} style={styles.columnButton}>
                    <Image source={pressPlayImg} style={{width: 80, height: 80}} />
                    <Text style={{paddingLeft: 30, fontSize: 22}}>Start Voting</Text>
                  </TouchableOpacity>
                }

                { (global.username === deck.owner) && (!deck.voting_started) && (deck.cards.length < 2)  &&
                  <TouchableOpacity onPress={() => Toast.show('There must be at least 2 suggestions before starting a vote!')} style={[styles.columnButton, {backgroundColor: '#c9c9c980'}]}>
                    <Image source={pressPlayImg} style={{width: 80, height: 80}} />
                    <Text style={{paddingLeft: 30, fontSize: 22}}>Start Voting</Text>
                  </TouchableOpacity>
                }
                { (global.username !== deck.owner) && (votingStatus == 'notStarted') &&
                  <TouchableOpacity onPress={() => Toast.show('Please wait for the deck owner to start the vote!')} style={[styles.columnButton, {backgroundColor: '#c9c9c980'}]}>
                    <Image source={pressPlayImg} style={{width: 80, height: 80}} />
                    <Text style={{paddingLeft: 30, fontSize: 22}}>Start Voting</Text>
                  </TouchableOpacity>
                }

                { deck.voting_started && (votingStatus !== 'completed') && (!hasVoted) &&
                  <TouchableOpacity onPress={() => handleVoteNow()} style={styles.columnButton} >
                    <Image source={pressPlayImg} style={{width: 80, height: 80}} />
                    <Text style={{paddingLeft: 30, fontSize: 22}}>Vote now</Text>
                  </TouchableOpacity>
                }

                { deck.voting_started && (votingStatus !== 'completed') && (hasVoted) &&
                  <TouchableOpacity onPress={() => Toast.show('Results will be viewable after all users have voted.')} style={[styles.columnButton, {backgroundColor: '#c9c9c980'}]}>
                    <Image source={pressPlayImg} style={{width: 80, height: 80}} />
                    <Text style={{paddingLeft: 30, fontSize: 22}}>View Results</Text>
                  </TouchableOpacity>
                }

                { (votingStatus === 'completed') &&
                  <TouchableOpacity onPress={() => handleViewResults()} style={styles.columnButton} >
                    <Image source={pressPlayImg} style={{width: 80, height: 80}} />
                    <Text style={{paddingLeft: 30, fontSize: 22}}>View Results</Text>
                  </TouchableOpacity>
                }
              </View>
            </View>
          </View>
        }
    </ImageBackground>
  );
}