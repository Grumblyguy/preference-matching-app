import React, { useEffect, useState, Component } from 'react';
import { View, Text, TouchableOpacity, Button, ActivityIndicator, FlatList, Image, ImageBackground} from "react-native";
import { navbarOptions } from '../Nav/NavbarOptions';
import { createStackNavigator } from '@react-navigation/stack';

import styles from './style';
import background from '../../assets/images/background.png';
import defaultCardImg from '../../assets/images/deckPic.png';

import ViewSuggestions from '../view-suggestions/ViewSuggestions';

const Stack = createStackNavigator();
const API_URL = "http://54.252.181.63";


export default function FinalResult({ route, navigation }) {
  const [card, setCard] = useState({});
  const { deckId, groupId } = route.params;

  useEffect(() => {
    // ensures correct final result is shown for all users for a deck
    if (`${groupId}:${deckId}` in global.finalResult) {
      setCard(global.finalResult[`${groupId}:${deckId}`]);
    }
    else {
      fetchWinningSuggestion();
    }
  }, []);

  const fetchWinningSuggestion = async () => {
    // get group then find deck === deckId, get cards and find card with max likes
    const url = `${API_URL}/group/${groupId}`;
    const res = await fetch(url);

    const body = await res.json();
    const deck = body.decks.find(d => (d.id === deckId));
    const cards = deck.cards;

    // cards with added like percentages
    const newCards = cards.map(c => {
      const likePercentage = calculateLikePercentage(c.likes, c.nopes);
      return { ...c, likePercentage };
    })
    
    const highestNumLikes = Math.max.apply(Math, newCards.map(c => { return c.likes }));
    const highestLikesCards = newCards.filter(c => c.likes === highestNumLikes);

    // if there are multiple cards with highest likes, then randomly pick one
    if (highestLikesCards.length > 1) {
      const highestPercentage = Math.max.apply(Math, highestLikesCards.map(c => { return c.likePercentage }));
      const highestPercentageCards = highestLikesCards.filter(c => c.likePercentage === highestPercentage);

      if (highestPercentageCards.length > 1) {
        // else if there's still multiple with same likePercentage, pick a random one
        const randomIndex = Math.floor(Math.random() * highestPercentageCards.length);
        const suggestion = highestPercentageCards[randomIndex];
        setCard(suggestion);
        global.finalResult[`${groupId}:${deckId}`] = suggestion;
      }
      else {
        // it's just one card with highest percentage
        setCard(highestPercentageCards[0]);
        global.finalResult[`${groupId}:${deckId}`] = highestPercentageCards[0];
      }
    } 
    else {
      const likePercentage = calculateLikePercentage(highestLikesCards[0].likes, highestLikesCards[0].nopes);
      const suggestion = { ...highestLikesCards[0], likePercentage };
      setCard(suggestion);
      global.finalResult[`${groupId}:${deckId}`] = suggestion;
    }
  };

  const calculateLikePercentage = (likes, nopes) => {
    if (likes === 0 && nopes === 0) {
      return 0;
    }

    const likePercentage = (likes / (likes + nopes) * 100);
    var temp = Math.round(likePercentage * 100) / 100
    return temp;
  }

  const handleViewAllResults = () => {
    navigation.navigate('FinalStatistics', { deckId, groupId });
  };

  const handleReturnToDecks = () => {
    navigation.navigate('Decks');
  };

  return (
    <ImageBackground source={background} style={styles.container}>
      <Text style={styles.winningHeaderText}>Winner ({card.likePercentage}%)</Text>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.heading}>{card.id}</Text>
          <Image source={defaultCardImg} style={styles.cardImage}/>
          <Text style={styles.description}>{card.description}</Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleViewAllResults} style={styles.resultsButton}>
          <Text style={styles.resultsText}>View all results</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleReturnToDecks} style={styles.decksButton}>
          <Text style={styles.decksText}>Return to Decks</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};