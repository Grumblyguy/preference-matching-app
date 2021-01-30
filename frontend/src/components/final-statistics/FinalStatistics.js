import React, { useEffect, useState, Component } from 'react';
import { View, Text, Button, FlatList, Image, ImageBackground} from "react-native";
import { navbarOptions } from '../Nav/NavbarOptions';
import { createStackNavigator } from '@react-navigation/stack';
import * as Progress from 'react-native-progress';

import styles from './style';
import background from '../../assets/images/background.png';
import defaultImg from '../../assets/images/deckPic.png';

const API_URL = "http://54.252.181.63";


export default function FinalStatistics({ route, navigation }) {
  const [cards, setCards] = useState([]);
  const { deckId, groupId } = route.params;

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    const getRequestOptions = {
      method: 'GET',
      headers: { "Content-Type": "application/json" }
    }

    // get decks using group id and then filter to get deck
    const url = `${API_URL}/group/${groupId}`;
    const response = await fetch(url, getRequestOptions);

    const body = await response.json();
    const decks = body.decks; 
    const deck = decks.find(d => d.id === deckId);

    const customCards = deck.cards.map(c => {
      const votePercentage = calculateVotePercentage(c.likes, c.nopes);
      const newCard = { ...c, votePercentage };
      return newCard; 
    });
    
    // sort cards in descending order to show top card first
    customCards.sort((a, b) => b.votePercentage > a.votePercentage);
    setCards(customCards);
  };

  const calculateVotePercentage = (likes, nopes) => {
    const votePercentage = (likes / (likes + nopes)) * 100;
    var blah = Math.round(votePercentage * 100) / 100;
    return blah;
  };

  const renderCard = ({ id, votePercentage }) => {
    const voteRatio = votePercentage / 100;

    return (
      <View style={styles.cardContainer} key={id}>
        <Image source={defaultImg} style={styles.cardImage} />
        <View style={styles.cardDetails}>
          <Text style={styles.cardTitle}>{id}</Text>
          <Progress.Bar progress={voteRatio} width={250} backgroundColor='white'/>
        </View>
        <Text style={styles.cardPercentage}>{votePercentage}%</Text>
      </View>
    );
  };

  return (
    <ImageBackground source={background} style={[ {flex: 1}, styles.container ]}>
      <Text style={{ fontSize: 17, color: 'white', marginVertical: 10, marginHorizontal: '8%', textAlign: 'center' }}>The bar and percentage represents the like/nope ratio</Text>     
      <View style={styles.flatlistContainer}>
         { cards.map(card => renderCard(card)) }  
      </View>
    </ImageBackground>
  );
};