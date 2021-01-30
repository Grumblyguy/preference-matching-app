import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, FlatList, ImageBackground, Modal, TextInput, Dimensions, ActivityIndicator } from "react-native";
import { navbarOptions } from "../Nav/NavbarOptions";
import { CheckBox } from 'react-native-elements'
import { createStackNavigator } from "@react-navigation/stack";
import { FloatingAction } from "react-native-floating-action";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

import styles from "./style";
import deckImg from "../../assets/images/deckPic.png";
import verticalEllipsis from "../../assets/images/verticalEllipsis.png";
import curlyArrow from "../../assets/images/curlyArrow.png";
import background from '../../assets/images/background.png';
import filterImg from '../../assets/images/filter.png';
import downArrow from '../../assets/images/downArrow.png';
import backArrow from '../../assets/images/back.png';
import deleteImg from '../../assets/images/delete.png';
import plusIcon from '../../assets/images/plusIcon.png';

import CreateDeck from "../create-deck/CreateDeck";
import Deck from "../deck/Deck";
import ViewSuggestions from '../view-suggestions/ViewSuggestions';
import AddSuggestion from '../add-suggestion/AddSuggestion';
import Voting from '../voting/Voting';
import FinalResult from '../final-result/FinalResult';
import FinalStatistics from '../final-statistics/FinalStatistics';

const Stack = createStackNavigator();
const screen = Dimensions.get("window");
const MAX_VISIBLE_DECK_TEXT = 17;
const API_URL = "http://54.252.181.63";


export default function Decks( {route, navigation} ) {
  return (
    <Stack.Navigator
      initialRouteName="Decks"
      screenOptions={navbarOptions({ navigation })}
    >
      <Stack.Screen
        name="Decks"
        component={DecksScreen}
        options={{ title: "Decks" }}
      />
      <Stack.Screen name="Deck" component={Deck} options={{ title: "Deck" }}/>
      <Stack.Screen name="CreateDeck" component={CreateDeck} options={{ title: "New deck" }}/>
      <Stack.Screen name="ViewSuggestions" component={ViewSuggestions} options={{ title: "Suggestions" }}/>
      <Stack.Screen name="AddSuggestion" component={AddSuggestion} options={{ title: "New suggestion" }}/>
      <Stack.Screen name="Voting" component={Voting} options={{ title: "Voting" }}/>
      <Stack.Screen name="FinalResult" component={FinalResult} options={{ title: "Result" }}/>
      <Stack.Screen name="FinalStatistics" component={FinalStatistics} options={{ title: "All Results" }}/>
    </Stack.Navigator>
  );
}

export function DecksScreen({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [removeModal, setRemoveModal] = useState(false);
  const [decks, setDecks] = useState([]);
  const [isGroupMember, setIsGroupMember] = useState(false);
  const [modal1, setModal1] = useState(global.introPhase == 2);
  const [modal2, setModal2] = useState(global.introPhase == 3);
  const [filtered, setFiltered] = useState([]);
  const [filterModal, setFilterModal] = useState(false);
  const [alphaChecked, setAlphaChecked] = useState(false);
  const [filterMode, setFilterMode] = useState("");
  const [revAlphaChecked, setRevAlphaChecked] = useState(false);
  const [groupChecked, setGroupChecked] = useState(false);
  const [completedChecked, setCompletedChecked] = useState(false);
  const [currentDeck, setCurrentDeck] = useState({});
  const isFocused = useIsFocused();
  
  useEffect(() => {
    if (isFocused){
      if(global.introPhase === 2){
        setModal1(true);
      }
      setIsLoading(true);
      fetchDecks();
    }
  }, [isFocused]);

  const fetchGroups = async () => {
    const url = `${API_URL}/user/${global.username}`;
    const res = await fetch(url);
    const fetchedGroups = await res.json();
    var tempGroups = fetchedGroups.group_ids;

    // check if user is in any group 
    const isMember = ((tempGroups.length !== 0) ? true : false);
    setIsGroupMember(isMember);

  }
  const fetchDecks = async () => {
    // fetch decks
    const url = `${API_URL}/user/${global.username}/decks`;
    const res = await fetch(url);

    const fetchedDecks = await res.json();

    // check if user is in any group 
    const isMember = ((fetchedDecks.length !== 0) ? true : false);
    
    // add voting status to each deck (not started | started | completed)
    const finalDecks = fetchedDecks.map((deck) => {
      const votingStatus = getDeckVotingStatus(deck);
      const newDeck = { ...deck, voting_status: votingStatus };
      return newDeck;
    });

    setDecks(finalDecks);
    setFiltered(finalDecks);
    setIsLoading(false);

    fetchGroups();
  };

  const handleDeck = (deck) => {
    navigation.navigate("Deck", { deck });
  };

  const handleNewDeckButton = () => {
    navigation.navigate("CreateDeck");
  };

  const deckExists = ({ id }) => {
    if (decks.length === 0) return false;

    return decks.some((d) => d.id === id);
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

  const getDeckVotingStatus = ({ voting_started, user_ids, voted_ids }) => {
    const users = convertStringToArray(user_ids);
    const usersVoted = convertStringToArray(voted_ids);

    // not started
    if (voting_started) {
      // if not completed, return started
      if (usersVoted.length === users.length) {
        return 'Completed';
      }
      else {
        // it is completed, return completed
        return 'Started';
      }
    } 
    else {
      return 'Not started';
    }
  };

  const renderVotingStatus = (votingStatus) => {
    let statusStyle;

    switch(votingStatus) {
      case 'Not started':
        statusStyle = { color: 'red', fontWeight: 'bold' };
        break;
      case 'Started':
        statusStyle = { color: 'green', fontWeight: 'bold' };
        break;
      case 'Completed':
        statusStyle = { color: 'grey', fontWeight: 'bold' };
        break;
      default:
        break;
    }

    return (
      <View style={{ flexDirection: 'row', marginLeft: 4 }}>
        <Text>Voting status: </Text>
        <Text style={statusStyle}>{votingStatus}</Text>
      </View>
    );
  };

  const renderVisibleText = (fullText) => {
    if (fullText.length > MAX_VISIBLE_DECK_TEXT) {
      return (fullText.substring(0, MAX_VISIBLE_DECK_TEXT) + '...');
    }
    else {
      return fullText;
    }
  };

  const renderModal1 = () => {
    function closeModal(){
      setModal1(false);
      global.introPhase = -1;
    }
    function nextModal(){
      global.introPhase == 3;
      setModal1(false);
      setModal2(true);
    }

    return (
    <Modal transparent={true} visible={modal1}>
      <View style={[styles.introModalContainer2, {backgroundColor: '#99999965'}]}>
        <View style={[styles.modalBox, {flex: 1}]} opacity={0.99}>
          <Text style={[styles.modalText, {paddingTop: 10}]}>This is the decks page, you can also access it at anytime from the bottom tab</Text>
          <View style={{flexDirection: 'row', alignItems: 'center', paddingTop:20}}>
              <TouchableOpacity style={styles.modalButton} onPress={() => nextModal()}>
                <Text> Next </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => closeModal()}>
                <Text> Exit </Text>
              </TouchableOpacity>
          </View>
          <View style={styles.leftArrow}>
            <Image source={downArrow} style={styles.imageSmall} />
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
      setModal2(false);
      global.introPhase = 4;
      navigation.navigate('Groups');
    }
    return(
    <Modal transparent={true} visible={modal2}>
      <View style={styles.introModalContainer}>
        <View style={styles.modalBox} opacity={0.99}>
          <Text style={[styles.modalText, {paddingTop: 10}]}> Here you can create 'Decks' in order to get voting on your preferences.</Text>
          <Text style={[styles.modalText, {paddingTop: 10}]}> A 'Deck' is a collection of preferences input by you and your friends, you can then vote on these inside the deck to decide on a final choice!</Text>
          <Text style={[styles.modalText, {paddingTop: 10}]}> You can create a deck using the 'plus' button in the bottom right </Text>
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
  
  const _renderItem = ({ item }) => (
    <View style={styles.deckContainer}>
      <TouchableOpacity
        style={styles.deckContainerButton}
        name={item.id}
        onPress={() => handleDeck(item)}
      >
        <Image source={deckImg} style={styles.deckImg} />
        <View style={styles.deckTexts}>
          <Text style={styles.deckTitle}> {renderVisibleText(item.id)} </Text>
          <Text> {item.group_id} </Text>
          <Text style={{ marginTop: 10 }}> {renderVisibleText(item.description)} </Text>
          {renderVotingStatus(item.voting_status)}
        </View>
        
      </TouchableOpacity>
      <View>
        <TouchableOpacity style={styles.ellipsisButton} onPress={() => openRemoveModal(item)}>
          <Image source={verticalEllipsis} style={styles.verticalEllipsis} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.miniButton} onPress={() => handleDeck(item)}/>
      </View>
    </View>
  );

  const openRemoveModal = (deck) => {
    setRemoveModal(true);
    setCurrentDeck(deck);
  }

  const renderDecks = () => {
    return (
      <View style={styles.decksContainer}>
        {renderSearchAndFilter()}
        <FlatList
          data={filtered}
          keyExtractor={(item) => `${item.group_id}:${item.id}`}
          renderItem={_renderItem}
          style={{paddingTop: 10}}
        ></FlatList>
      </View>
    );
  };

  const renderNoDecksScreen = () => {
    return (
      <View style={styles.noDecksContainer}>
        <Text style={styles.noDecksText}>
          You have no decks! {"\n\n"}
          Press on the Add icon in the bottom right to create a deck!
        </Text>
      </View>
    )
  };

  const renderNoGroupsScreen = () => {
    return (
      <View style={styles.noDecksContainer}>
        <Text style={styles.noGroupsText}>
          You are not in a group! 
          Create a group in order to start creating decks!
        </Text>

        <TouchableOpacity style={styles.createGroupButton} onPress={() => navigation.navigate("Groups")}>
          <Text style={styles.groupsButtonText}>Go to Groups page</Text>
        </TouchableOpacity>
      </View>
    )
  };

  function changeFilter(){
    if (filterMode == 'alphabetical') {
      var temp = decks;
      setDecks(temp.sort(function (a, b) {
        return a.id.localeCompare(b.id); //using String.prototype.localCompare()
      }));
      setFiltered(decks);
    } else if (filterMode == 'revalphabetical') {
      var temp = decks;
      temp = temp.sort(function (a, b) {
        return a.id.localeCompare(b.id); //using String.prototype.localCompare()
      });
      setDecks(temp.reverse());
      setFiltered(decks);
    } else if (filterMode == 'group') {
      var temp = decks;
      setDecks(temp.sort(function (a, b) {
        return a.group_id.localeCompare(b.group_id); //using String.prototype.localCompare()
      }));
      setFiltered(decks);
    } else if (filterMode == 'completed') {
      var startedDecks = decks.filter((deck) => getDeckVotingStatus(deck) == 'Started')
      var notStartedDecks = decks.filter((deck) => getDeckVotingStatus(deck) == 'Not started');
      var completedDecks = decks.filter((deck) => getDeckVotingStatus(deck) == 'Completed')
      setDecks(startedDecks.concat(notStartedDecks).concat(completedDecks));
      setFiltered(startedDecks.concat(notStartedDecks).concat(completedDecks));
    }
  }

  const renderFilterModal = () => {
    return(
    <Modal transparent={true} visible={filterModal}>
      <View style={styles.introModalContainer}>
        <View style={styles.modalBox} opacity={0.99}>
        <Text style={{fontWeight: 'bold', paddingBottom: 20, fontSize: 20}}>Sort Decks</Text>
        <CheckBox
          center
          title='Alphabetical'
          checkedIcon='dot-circle-o'
          uncheckedIcon='circle-o'
          checked={alphaChecked}
          onPress={() => {setAlphaChecked(!alphaChecked);
                          setFilterMode('alphabetical');
                          setRevAlphaChecked(false);
                          setGroupChecked(false);
                          setCompletedChecked(false); }}
        />
        <CheckBox
          center
          title='Reverse-Alphabetical'
          checkedIcon='dot-circle-o'
          uncheckedIcon='circle-o'
          checked={revAlphaChecked}
          onPress={() => {setRevAlphaChecked(!revAlphaChecked);
                          setFilterMode('revalphabetical');
                          setAlphaChecked(false);
                          setGroupChecked(false);
                          setCompletedChecked(false); }}
        />
        <CheckBox
          center
          title='Sort by Group'
          checkedIcon='dot-circle-o'
          uncheckedIcon='circle-o'
          checked={groupChecked}
          onPress={() => {setGroupChecked(!groupChecked);
                          setFilterMode('group');
                          setAlphaChecked(false);
                          setRevAlphaChecked(false);
                          setCompletedChecked(false); }}
        />
        <CheckBox
          center
          title='Sort by Voting Status'
          checkedIcon='dot-circle-o'
          uncheckedIcon='circle-o'
          checked={completedChecked}
          onPress={() => {setCompletedChecked(!completedChecked);
                          setFilterMode('completed');
                          setAlphaChecked(false);
                          setRevAlphaChecked(false);
                          setGroupChecked(false); }}
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
        <Image style= {{width: 30, height: 30,}} source={filterImg} />
      </TouchableOpacity>
    </View>
    )
  }

  function searchFunction(text) {
    if (text == ''){
        setFiltered(decks);
    } else {
        var result = decks;
        setFiltered(result.filter((deck) => deck.id.toLowerCase().includes(text.toLowerCase()) || deck.group_id.toLowerCase().includes(text.toLowerCase())));
    }
  }

  const renderSearchBar = () => {
    return (
      <View style={styles.searchBarContainer}>
        <View style={styles.search}>
          <TextInput
              placeholder='Search for deck or group name!'
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
    <View style={{paddingBottom: 10, paddingTop: 10, paddingLeft: 7}}>
      <View style={{flexDirection: 'row', height: 40}}>
        {renderSearchBar()}
        {renderFilter()}
      </View>
    </View> )
  }

  const renderRemoveModal = () => {
    if (currentDeck.voted_ids == undefined){
      return;
    }

    return(
      <Modal transparent={true} visible={removeModal}>
        <View style={styles.introModalContainer}>
          <View style={styles.modalBox2} opacity={0.99}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity style={styles.modalButton2}  onPress={() => setRemoveModal(false)}>
                  <Image source={backArrow} style={{width: 50, height: 50}} />
                  <Text style={{textAlign: 'center', paddingTop: 5}}>Back</Text>
                </TouchableOpacity>
                { currentDeck.owner == global.username && 
                <TouchableOpacity style={styles.modalButton2} onPress={() => removeDeck()}>
                  <Image source={deleteImg} style={{width: 40, height: 40}} />
                  <Text style={{textAlign: 'center', paddingTop: 10}}>Remove Deck</Text>
                </TouchableOpacity>
                }
                { currentDeck.owner != global.username && getDeckVotingStatus(currentDeck) == 'Completed' &&
                 <TouchableOpacity style={styles.modalButton2} onPress={() => removeDeck()}>
                  <Image source={deleteImg} style={{width: 40, height: 40}} />
                  <Text style={{textAlign: 'center', paddingTop: 10}}>Remove Deck</Text>
                </TouchableOpacity>    
                }
                { currentDeck.owner != global.username && (getDeckVotingStatus(currentDeck) == 'Not Started' || getDeckVotingStatus(currentDeck) == 'Started') &&
                 <TouchableOpacity style={[styles.modalButton2, {opacity: 0.5}]} onPress={() => Toast.show('Only the deck owner can remove a deck before voting is done')}>
                    <Image source={deleteImg} style={{width: 40, height: 40}} />
                    <Text style={{textAlign: 'center', paddingTop: 10}}>Remove Deck</Text>
                  </TouchableOpacity>  
                }
            </View>
          </View>
        </View>   
      </Modal>
    )
  }

  async function removeDeck() {
    var temp = decks;
    setDecks(temp.filter((deck) => deck.id != currentDeck.id));
    setFiltered(temp.filter((deck) => deck.id != currentDeck.id));   
    await fetch(`${API_URL}/group/` + currentDeck.group_id + '/deck/' + currentDeck.id, {
            method: 'DELETE',
      }).then((response) => response.json())
      .catch((error) => console.error(error));
    setRemoveModal(false);
  }

  const renderAddButton = () => {
    return(
      <TouchableOpacity onPress={() => handleNewDeckButton()}>
        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 45,
          }}
        >
          <Image source={plusIcon} style={{width: 70, height: 70}} />
        </View>
      </TouchableOpacity>
    )
  }

  const renderLoadingScreen = () => {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <ActivityIndicator color="#ffffff" size="large" />
      </View>
    );
  }; 

  const renderContent = () => {
    if (isLoading) {
      return renderLoadingScreen();
    }
    else if (!isGroupMember) {
      return renderNoGroupsScreen();
    }
    else if (decks.length === 0) {
      return renderNoDecksScreen();
    }
    else 
    { 
      return renderDecks(); 
    }
  };

  return (
    <ImageBackground source={background} style={styles.container}>
      {renderModal1()}
      {renderModal2()}
      {renderFilterModal()}
      {renderRemoveModal()}

      <View style={{zIndex: 0, paddingTop: 10, height: screen.height*0.75}}>
        {renderContent()}
      </View>
      
      <View style={styles.floatinBtn}>
        { !isLoading && renderAddButton()}
      </View>
    </ImageBackground>
  );
}
