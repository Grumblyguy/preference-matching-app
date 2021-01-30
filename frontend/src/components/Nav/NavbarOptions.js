
import { useIsFocused } from '@react-navigation/native';
import React, { useState, useContext, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Dimensions, Modal, Text, FlatList } from "react-native";
import bellIcon from '../../assets/images/bell.png';
import bellNotif from '../../assets/images/bellNotif.png';
import settingsIcon from '../../assets/images/settings.png';
import SendNotification from './Notification';

const screen = Dimensions.get("window");


const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: '#F89333',
        elevation: 40,
    },
    drawerStyle: {
        backgroundColor: '#edebeb',
        width: 240,
    }, 
    image: {
        paddingBottom: 20,
    },
    settingsButton:{
        paddingRight: 20,
    },
    rowContainer:{
        flexDirection: "row",
    },
    modalContainer:{
        height: screen.height,
        width: screen.width,
        alignItems: 'center',
        backgroundColor: '#000000aa',
        paddingTop: screen.height/55,
    },
    container:{
        justifyContent: 'center',
        alignItems:'center',
        flex: 1,
    }, 
    modal: {
        borderRadius: 25,
        backgroundColor: '#F89333',
        width: screen.width-20,
    },
    bellButton: {
        paddingLeft: screen.width/2,
        flex: 1,
        maxHeight: 20,
    },
    buttonText: {
        textAlign: 'center',
        paddingTop: 5,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop: 10,
        color: "#ffffff",
        paddingLeft: 20,
    },
    button:{
        width: screen.width - 40,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 5,
        paddingTop: 5,
    },
    imageSmall: {
        width: 32,
        height: 32,
        
    },
    notifHeading: {
        backgroundColor: '#000000',
        flexDirection: 'row',
    },
    setting: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalOptions: {
        borderRadius: 25,
        backgroundColor: '#ffffff',
        width: screen.width-20,
        height: screen.height/2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
    },
    notifButton: {
        margin: 10,
        height:32,
        width: 90,
    },
    modalButton: {
        margin: 5,
        backgroundColor: 'white',
        borderRadius: 15,
        minWidth: screen.width/10,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tutButton:{
        width: screen.width/3,
        height: screen.height/8,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8933380',
        borderRadius: 25,
        margin: 15,
    }

});


export const navbarOptions = ({navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modal2Visible, setModal2Visible] = useState(false);
    const testNotifications = ["notif1", "notif2", "notif3", "notif4"]
    const [notifications, setNotifications] = useState([]);
    const [lastRefresh, setLastRefresh] = useState(0);
    const [activeNav, setActiveNav] = useState("All");
    const [filtered, setFiltered] = useState([]);
    const isFocused = useIsFocused();

    function fetchNotifs(){
        function getNotif(){
            var url = 'http://54.252.181.63/user/' + global.username
            return fetch(url)
            .then((response) => response.json())
            .catch((error) => console.error(error));
          }
         
          function getAll(){
            return Promise.all([getNotif()])
          }
          
          // When this Promise resolves, both values will be available.
          getAll()
            .then(([notifs]) => {
              // both have loaded!
              setNotifications(notifs.notifs.reverse());
              setFiltered(notifs.notifs.reverse());
          })
    }

    useEffect(() => { 
        if (isFocused) {
            fetchNotifs(); 
        }
    }, [isFocused]);
    

    function lastWord(words) {
        var n = words.split(" ");
        return n[n.length - 1];
    }
    async function handleFriendDecision(item, decision){
        if (decision == 'accept'){
            var addUser = lastWord(item.message);   
            
            await fetch("http://54.252.181.63/user/" + global.username + "/friend_request?friend_id=" + addUser, {
                method: 'POST',
            }).then((response) => response.json())
            .catch((error) => console.error(error));
            SendNotification(addUser, 'friendAccept');
        }      
        removeNotif(item);
    }

    function handleGroupDecision(item, decision){
        if (decision == 'accept'){ 
            var groupId = lastWord(item.message.split('%').join('%20'));

            fetch("http://54.252.181.63/user/" + global.username + "/accept_group?group_id=" + groupId, {
                    method: 'POST',
                }).then((response) => response.json())
                .catch((error) => console.error(error));
         }

        removeNotif(item);
    }

    function handleDeckPress(item) {
        removeNotif(item);
        navigation.navigate('Decks');

    }
    function removeNotif(item){
        fetch('http://54.252.181.63/user/'+ global.username + '/notifs?id=' + item.id.toString(), {
            method: 'DELETE',
        }).then((response) => response.json())
        .catch((error) => console.error(error));

         var tempNotif = notifications.filter(x=> x.id != item.id);
        setNotifications(tempNotif);
        setFiltered(tempNotif);
      
    }


    
    
    
    const _renderItem = ({ item }) => (
        <View>
            { item.category == "Group" && 
            <View style={[styles.button]}>
                <Text style={styles.buttonText}> {item.message.split('%').join(' ')} </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}> 
                    <TouchableOpacity onPress={() => handleGroupDecision(item, 'accept')}>
                        <Image source={require('../../assets/images/accept.png')} style={styles.notifButton} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleGroupDecision(item, 'decline')}>
                        <Image source={require('../../assets/images/decline.png')} style={styles.notifButton}  />
                    </TouchableOpacity>

                </View>
            </View>
            }
            { item.category == "Friend" && 
            <View style={[styles.button]}>
                <Text style={styles.buttonText}> {item.message} </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}> 
                    <TouchableOpacity onPress={() => handleFriendDecision(item, 'accept')}>
                        <Image source={require('../../assets/images/accept.png')} style={styles.notifButton} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleFriendDecision(item, 'decline')}>
                        <Image source={require('../../assets/images/decline.png')} style={styles.notifButton}  />
                    </TouchableOpacity>

                </View>
            </View>
            }
           
           { item.category == "Deck" && 
           <TouchableOpacity style={[styles.button, {minHeight: 25}]} onPress={() => handleDeckPress(item)}>
                <Text style={[styles.buttonText, {paddingBottom: 5, paddingTop: 5}]}> {item.message} </Text>
            </TouchableOpacity>
            }   

            { item.category == "friendAccept" && 
           <TouchableOpacity style={[styles.button, {minHeight: 25}]} onPress={() => removeNotif(item)}>
                <Text style={[styles.buttonText, {paddingBottom: 5, paddingTop: 5}]}> {item.message} </Text>
            </TouchableOpacity>
            }   

        </View>
            
    );

    const FlatListItemSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#000",
            }}
          />
        );
      }

    function logOutButton(){
        global.username = "";
        setModal2Visible(false);
       navigation.replace('Login');
    }
    
    function notifPressed(){
        fetchNotifs();
        setLastRefresh(lastRefresh + 1);
        setModalVisible(true);
    }

    function changeNav(newNav){
        setActiveNav(newNav);
        if (newNav == "All"){
            setFiltered(notifications);
        }else if(newNav == "Friend"){
            setFiltered(notifications.filter((notif) => (notif.category == "Friend") || (notif.category == "friendAccept") ))
        }else if(newNav == "Group"){
            setFiltered(notifications.filter((notif) => notif.category == "Group"))
        }else if(newNav == "Deck"){
            setFiltered(notifications.filter((notif) => notif.category == "Deck"))
        }
    }
    return (
        { headerTitleStyle: { color: '#ffffff' }, headerStyle: styles.headerStyle, headerRight: () => (
        <View style={styles.container}> 
            <Modal visible={modalVisible} transparent={true}>
                <View style={styles.modalContainer}> 
                    <TouchableOpacity onPress={()=>setModalVisible(false)} style={{paddingRight: screen.width - 70, paddingBottom: 20}}>
                        <Image source={require('../../assets/images/backIcon.png')} style={styles.imageSmall} />
                    </TouchableOpacity>
                    <View style={styles.modal}>      
                        <Text style={styles.text}> Notifications </Text> 
                        <View style={{flexDirection: 'row', paddingLeft: 20, paddingBottom: 5}}>
                            {activeNav == "All" ? 
                            <TouchableOpacity style={[styles.modalButton, {backgroundColor: '#bce3e6'}]} onPress={() => changeNav("All")} >
                                <Text>All</Text>
                            </TouchableOpacity> :
                            <TouchableOpacity style={styles.modalButton} onPress={() => changeNav("All")} >
                                <Text>All</Text>
                            </TouchableOpacity>
                            }
                            {activeNav == "Friend" ? 
                            <TouchableOpacity style={[styles.modalButton, {backgroundColor: '#bce3e6'}]} onPress={() => changeNav("Friend")} >
                                <Text>Friends</Text>
                            </TouchableOpacity> :
                            <TouchableOpacity style={styles.modalButton} onPress={() => changeNav("Friend")} >
                                <Text>Friends</Text>
                            </TouchableOpacity>
                            }
                            {activeNav == "Group" ? 
                            <TouchableOpacity style={[styles.modalButton, {backgroundColor: '#bce3e6'}]} onPress={() => changeNav("Group")} >
                                <Text>Groups</Text>
                            </TouchableOpacity> :
                            <TouchableOpacity style={styles.modalButton} onPress={() => changeNav("Group")} >
                                <Text>Groups</Text>
                            </TouchableOpacity>
                            }
                            {activeNav == "Deck" ? 
                            <TouchableOpacity style={[styles.modalButton, {backgroundColor: '#bce3e6'}]} onPress={() => changeNav("Deck")} >
                                <Text>Decks</Text>
                            </TouchableOpacity> :
                            <TouchableOpacity style={styles.modalButton} onPress={() => changeNav("Deck")} >
                                <Text>Decks</Text>
                            </TouchableOpacity>
                            }
                        </View>       
                        <View style={styles.modalOptions}>             
                            { !notifications.length ? <Text> You have no new Notifications </Text> : 
                            
                            <FlatList contentContainerStyle={{flexGrow: 1}}
                                        data={filtered} 
                                        keyExtractor={(item) => item.id.toString()} 
                                        renderItem={_renderItem}
                                        ItemSeparatorComponent = { FlatListItemSeparator }
                            />
                             }        
                        </View>                                                   
                    </View>                   
                </View>       
            </Modal>

            <Modal visible={modal2Visible} transparent={true}>
                <View style={styles.modalContainer}> 
                    <TouchableOpacity onPress={()=>setModal2Visible(false)} style={{paddingRight: screen.width - 70, paddingBottom: 20}}>
                        <Image source={require('../../assets/images/backIcon.png')} style={styles.imageSmall} />
                    </TouchableOpacity>
                    <View style={[styles.modal]}> 
                        <Text style={styles.text}> Settings </Text>
                        <View style={[styles.modalOptions, {height: 150, paddingBottom: 20, flexDirection: 'row'}]}>
                            <TouchableOpacity style={styles.tutButton} onPress={() => {global.introPhase = 0;
                                                                                        setModal2Visible(false);
                                                                                        navigation.navigate('Home')}}>
                                <Text style={{textAlign: 'center'}}>Start Tutorial</Text>
                            </TouchableOpacity>  
                            <TouchableOpacity style={[styles.tutButton, {flexDirection: 'row', backgroundColor: '#1186fa60'}]} onPress={() => logOutButton()}>
                                <Text style={{paddingRight: 20}}>Log Out</Text>
                                <Image source={require('../../assets/images/logout.png')} style={{width: 32, height: 32}}/>
                            </TouchableOpacity>     
                        </View>                                                                          
                    </View>                   
                </View>       
            </Modal>



            <View style={styles.rowContainer}>
              <TouchableOpacity style={styles.settingsButton} onPress={() => notifPressed()}>   
                    <Image source={notifications.length ? bellNotif : bellIcon } style={styles.image} />
                    
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsButton} onPress={() => setModal2Visible(true)}>
                <Image source={settingsIcon} style={styles.image} />
              </TouchableOpacity>
            </View> 
        </View> 
        )}
    );

}

