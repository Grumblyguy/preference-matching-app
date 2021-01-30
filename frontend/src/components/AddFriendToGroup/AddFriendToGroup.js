import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, TextInput} from "react-native";
import { FloatingAction } from "react-native-floating-action";
import Toast from 'react-native-simple-toast';
import _ from 'lodash';

import styles from './style';
import friendImg from '../../assets/images/friendPic.png';
import addFriendImg from '../../assets/images/addFriend.png';
import rightArrowImg from '../../assets/images/right-arrow.png';

import SendNotification from "../Nav/Notification";

const API_URL = "http://54.252.181.63";


export default function AddFriendToGroup({ route, navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFiltered] = useState([]);
  const [added, setAdded] = useState([]);
  const [memberData, setMemberData] = useState([]);

  const friendName = route.params.friendName;
  
  useEffect(() => { 
    // When this Promise resolves, both values will be available.
    getUsersandFriends()
      .then(([groupIds, friendGroupIds]) => {
        // both have loaded!
        const tempData = groupIds.group_ids.filter(value => !friendGroupIds.group_ids.includes(value)).filter((x) => x != "");
        setData(tempData);
        setFiltered(tempData);
    })
  }, []);

  const getGroupIds = () => {
    const url = `${API_URL}/user/` + global.username;
    return fetch(url)
    .then((response) => response.json());
  }

  const getFriendGroupIds = () => {
    const url = `${API_URL}/user/` + friendName;
    return fetch(url)
    .then((response) => response.json());
  }

  const getUsersandFriends = () => {
    return Promise.all([getGroupIds(), getFriendGroupIds()]);
  }
  
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
    
  const searchFunction = (text) => {
    if (text == ''){
      setFiltered(data);
    } 
    else {
      const result = data;
      setFiltered(result.filter(word => word.toLowerCase().includes(text.toLowerCase())));
    }
  }

  const _renderItem = ({ item }) => (
    <View style={{flexDirection: 'row', flex: 1, margin: 5, paddingTop: 10, justifyContent: "center", alignItems: 'center'}}>
      <Image source={friendImg} style={styles.imageSmall} />
      <TouchableOpacity onPress={() => handleAddMember(item)} style={styles.button} name={item}>
        <View style={{width: 220}}>
          <Text style={styles.buttonText}> {item} </Text>
        </View>  
        <Image source={addFriendImg} style={[styles.imageSmall, {width: 32, height: 32}]} />
      </TouchableOpacity>
    </View>   
  );

  const handleAddMember = (groupName) => {
    fetch(`${API_URL}/group/` + groupName + "/invite?user_id=" + friendName, {
      method: 'POST',
    }).then((response) => response.json())
      .catch((error) => console.error(error));

    const temp = data;
    setData(data.filter((x) => x != groupName));
    Toast.show("Invited " + friendName + " to " + groupName);
    SendNotification(friendName, "Group", groupName);
  }
  
  return (
    <View style={styles.container}>
      <View style = {styles.searchContainer}>
        <Text style={styles.memberText}> Add Friend to Group </Text>
        <View style={styles.buttonContainer}>
          { data.length ? 
          <FlatList ListHeaderComponent={renderHeader} contentContainerStyle={{flexGrow: 1}} data={filteredData} keyExtractor={item => item} renderItem={_renderItem}></FlatList>
            : <Text>This friend is already a member of all of your groups</Text>
          } 
        </View>
      </View>
      <FloatingAction
        showBackground={false}
        floatingIcon={rightArrowImg}
        iconWidth={20}
        iconHeight={20}
        onPressMain={() => navigation.navigate('FriendScreen', {friendName: friendName})}
      />
    </View>
  );
}
