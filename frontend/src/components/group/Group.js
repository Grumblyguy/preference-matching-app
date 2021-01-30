import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, TextInput,KeyboardAvoidingView, Modal } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import _ from 'lodash'

import styles from './style';
import friendPic from '../../assets/images/friendPic.png';
import backIcon from '../../assets/images/backIcon.png';
import cameraImg from '../../assets/images/camera.png';
import groupCardImg from '../../assets/images/groupcard.png';
import addUserIcon from '../../assets/images/addUser.png';
import deleteGroupImg from '../../assets/images/deleteGroup.png';


export default function Group({ route, navigation }) {
  const [data, setData] = useState([]);
  const [filteredData, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invited, setInvited] = useState([]);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const isFocused = useIsFocused();

  const groupNameText = route.params.groupName;

  const fetchOptions = {
    method: 'GET',
    headers:{
      'Accept': 'application/json',
      'Content-Type':'application/json'
    }
  }

  useEffect(() => { 
    if (isFocused) {
      function getGroup() {
        const url = 'http://54.252.181.63/group/' + groupNameText;
        return fetch(url, fetchOptions)
        .then((response) => response.json())
        .catch((error) => console.error(error));
      }
  
      function getFriends() {
        const url = 'http://54.252.181.63/user/' + global.username;
        return fetch(url, fetchOptions)
            .then((response) => response.json())
            .catch((error) => console.error(error));
      }
  
      function getUsersandFriends() {
        return Promise.all([getGroup(), getFriends()])
      }
      
      // When this Promise resolves, both values will be available.
      getUsersandFriends()
      .then(([group, friends]) => {
          // both have loaded!
          setData(group.user_ids.concat(group.invited_ids));
          setFiltered(group.user_ids.concat(group.invited_ids));
          setInvited(group.invited_ids);
      })
      .catch((err) => console.log(error));
    }
  }, [isFocused]);
  
  const renderHeader = (
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
  )
  
  function searchFunction(text) {
    if (text == ''){
      setFiltered(data);
    } else {
      const result = data;
      setFiltered(result.filter(word => word.toLowerCase().includes(text.toLowerCase())));
    }
  }

  const _renderItem = ({ item }) => (
    <View style={{flexDirection: 'row', flex: 1, margin: 5, paddingTop: 10}}>
      <Image source={friendPic} style={styles.imageSmall} />
      <TouchableOpacity style={styles.button} name={item}>
        { invited.includes(item) ? 
        <Text style={[styles.buttonText, {color: 'red'}]}> {item}  (Pending Invite)</Text>
        :
        <Text style={styles.buttonText}> {item} </Text>
        }   
      </TouchableOpacity>
    </View>
  );

  async function removeGroup(){ 
    setRemoveModalVisible(false);
    await fetch('http://54.252.181.63/user/'+ global.username + '/leave_group/' + groupNameText, {
      method: 'DELETE',
    }).then((response) => response.json())
    .catch((error) => console.error(error));
    
    navigation.navigate('GroupsNav', {newGroup: true});
  }

  return (
    <View style={styles.container}>
      <Modal style = {styles.modal} transparent={true} visible={removeModalVisible}>
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.backButton} onPress={() => setRemoveModalVisible(false)}>
            <Image source={backIcon} style={styles.backImage} />
          </TouchableOpacity>
          <View style={styles.buttonContainerModal}>
            <Text style={styles.buttonText}> Leave {groupNameText} ? </Text>
            <View style={[styles.buttonContainer], {flexDirection: "row"}}>
              <TouchableOpacity style={styles.modalButton} onPress={() => removeGroup()}>
                <Text style={styles.buttonText}> Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setRemoveModalVisible(false)}>
                <Text style={styles.buttonText}> No </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>                 
      </Modal>
        
      <Image source={cameraImg} style={styles.image} />
      <Text style={styles.groupTitle}> {groupNameText} </Text>
      <View style={[styles.groupOptions, {alignItems: 'center'}]}>
        <TouchableOpacity style={styles.imageButton} onPress={() => navigation.push('NewDeck', {groupName: groupNameText})}>
          <Image source={groupCardImg} style={styles.imageSmall} />
          <Text style={styles.textSmall}>Add Deck</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageButton} onPress={() => navigation.push('NewMemberGroup', {groupName: groupNameText})}>
          <Image source={addUserIcon} style={styles.imageSmall} />
          <Text style={styles.textSmall}>Add Members</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageButton} onPress={() => setRemoveModalVisible(true)}>
          <Image source={deleteGroupImg} style={styles.imageSmall} />
          <Text style={styles.textSmall}>Leave Group</Text>
        </TouchableOpacity>
      </View>
      <View style = {styles.searchContainer}>
        <Text style={styles.memberText}> Members </Text>
        <View style={styles.buttonContainer}>
          {renderHeader}
          <FlatList  data={filteredData} keyExtractor={item => item} renderItem={_renderItem}></FlatList>
        </View>
      </View>
    </View>
  );
}