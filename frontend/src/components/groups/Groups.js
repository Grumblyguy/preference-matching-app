import React, { useState, useEffect, component } from "react";
import { Component } from "react";
import { View, Text, TouchableOpacity, TextInput, ImageBackground, FlatList, Image, Modal, Dimensions, ActivityIndicator} from "react-native";
import { CheckBox } from 'react-native-elements'
import { navbarOptions } from '../Nav/NavbarOptions';
import { createStackNavigator } from '@react-navigation/stack';
import { FloatingAction } from "react-native-floating-action";
import { useIsFocused } from "@react-navigation/native";

import styles from './style';
import background from '../../assets/images/background.png';

import NewGroup from '../NewGroup/NewGroup'
import Group from "../group/Group"
import NewMemberGroup from '../NewMemberGroup/NewMemberGroup';
import CreateDeck from "../create-deck/CreateDeck";

const screen = Dimensions.get("window");
const Stack = createStackNavigator();


export default function Groups( {route, navigation} ){ 
  return (
    <Stack.Navigator initialRouteName="GroupsNav" screenOptions={navbarOptions({navigation})}>     
      <Stack.Screen name="GroupsNav" component={GroupsScreen} options={{ title: "Groups" }}/>
      <Stack.Screen name="groupPage" component={Group} options={{ title: "Group" }}/>
      <Stack.Screen name="NewGroup" component={NewGroup} options={{ title: "New group" }}/>
      <Stack.Screen name="NewMemberGroup" component={NewMemberGroup} options={{ title: "Add friend to group" }}/>
      <Stack.Screen name="NewDeck" component={CreateDeck} options={{title: "Create New Deck"}}/>
    </Stack.Navigator>   
  );
}


export function GroupsScreen( {route, navigation} ){
  const [filtered, setFiltered] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGroup, setNewGroup] = useState(false);
  const [modal1, setModal1] = useState(global.introPhase == 4);
  const [modal2, setModal2] = useState(global.introPhase == 5);
  const [filterModal, setFilterModal] = useState(false);
  const [alphaChecked, setAlphaChecked] = useState(false);
  const [filterMode, setFilterMode] = useState("");
  const [revAlphaChecked, setRevAlphaChecked] = useState(false);
  const isFocused = useIsFocused();
  
  function handleNewGroupButton(){
    navigation.push('NewGroup', {newGroup: false});
  }

  function fetchRequest() {
    const url = 'http://54.252.181.63/user/' + global.username;
    const fetchOptions = {
      method: 'GET',
      headers:{
        'Accept': 'application/json',
        'Content-Type':'application/json'
      }
    }

    fetch(url, fetchOptions)
      .then((response) => response.json())
      // .then((response) => response.text())
      // .then((responseData) => console.log(responseData))
      .then((json) => {setData(json.group_ids);
                      setFiltered(json.group_ids)})
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (isFocused) {
      if (global.redirectGroup == "") {
        fetchRequest()
        if (global.introPhase == 4) {
          setModal1(true);
        }
      } else {
        navigation.push('groupPage', {
          groupName: global.redirectGroup,
        });
        global.redirectGroup = "";
      }
    }
  }, [isFocused]);

  const _renderItem = ({ item }) => (
    <TouchableOpacity style={styles.button} name={item} onPress={() => {
      navigation.push('groupPage', {
        groupName: item,
      });
    }}>
      <Image source={require('../../assets/images/friendPic.png')} style={styles.imageSmall} />
      <Text style={styles.buttonText}> {item} </Text>
    </TouchableOpacity>
  );

  const renderModal1 = () => {
    function closeModal() {
      setModal1(false);
      global.introPhase = -1;
    }
    
    function nextModal() {
      setModal1(false);
      setModal2(true);
      global.introPhase = 5;
    }

    return (
      <Modal transparent={true} visible={modal1}>
        <View style={styles.introModalContainer}>
          <View style={styles.modalBox} opacity={0.99}>
            <Text style={[styles.modalText, {paddingTop: 10}]}> Welcome to the groups screen, where you can organise your friends togther in order to start deciding!</Text>
            <Text style={[styles.modalText, {paddingTop: 10}]}> Before you start creating groups, you should first start adding some friends</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', paddingTop:20}}>
                <TouchableOpacity style={styles.modalButton} onPress={() => nextModal()}>
                  <Text> Next </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => closeModal()}>
                  <Text> Exit </Text>
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
      global.introPhase = 6;
      setModal2(false);
      navigation.navigate('Friends');
    }

    return (
      <Modal transparent={true} visible={modal2}>
        <View style={styles.introModalContainer2}>
          <View style={[styles.modalBox, {flex: 1}]} opacity={0.99}>
            <Text style={[styles.modalText, {paddingTop: 10}]}>You can also access the Groups page from the bottom tab</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', paddingTop:20}}>
                <TouchableOpacity style={styles.modalButton} onPress={() => nextModal()}>
                  <Text> Next </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => closeModal()}>
                  <Text> Back </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.leftArrow}>
              <Image source={require('../../assets/images/downArrow.png')} style={styles.imageSmall} />
            </View>
          </View>
        </View>   
      </Modal>
    )
  }
  
  function changeFilter() {
    if (filterMode == 'alphabetical') {
      var temp = data;
      setData(temp.sort(function (a, b) {
        return a.localeCompare(b); //using String.prototype.localCompare()
      }));
      setFiltered(data);
    } else if (filterMode == 'revalphabetical') {
      var temp = data;
      temp = temp.sort(function (a, b) {
        return a.localeCompare(b); //using String.prototype.localCompare()
      });
      setData(temp.reverse());
      setFiltered(data);
    }
  }

  const renderFilterModal = () => {
    return (
      <Modal transparent={true} visible={filterModal}>
        <View style={styles.introModalContainer}>
          <View style={styles.modalBox} opacity={0.99}>
          <Text style={{fontWeight: 'bold', paddingBottom: 20, fontSize: 20}}>Sort Friends</Text>
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
    } else {
        const result = data;
        setFiltered(result.filter(word => word.toLowerCase().includes(text.toLowerCase())));
    }
  }

  const renderSearchBar = () => {
    return (
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
      </View> 
    )
  }

  const renderAddButton = () => {
    return(
      <TouchableOpacity onPress={()=> handleNewGroupButton()}>
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
          { !loading && data.length !== 0 && renderSearchAndFilter() }
          { !loading && data.length ?
          <FlatList columnWrapperStyle={styles.row} contentContainerStyle={{flexGrow: 1}} numColumns={2} data={filtered} keyExtractor={item => item} renderItem={_renderItem}></FlatList>
          :
          <Text style={styles.emptyText}>You are not in any groups! Press the bottom right icon to create one</Text>
          }
        </View>
        { loading && <View style={{alignItems: 'center', justifyContent: 'center',flex: 1}}><ActivityIndicator size={'large'} color={'white'}/></View>}

      </View>    
        <View style={styles.floatinBtn}>
          {renderAddButton()}
        </View>
          
      </ImageBackground>
    );
  }