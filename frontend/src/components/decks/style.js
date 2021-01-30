import COLOURS from "../../assets/colours";
import { wrap } from "lodash";
import { StyleSheet, Dimensions } from "react-native";

const screen = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 10,
  },
  headerStyle: {
    backgroundColor: "#F89333",
    elevation: 40,
  },
  drawerStyle: {
    backgroundColor: "#edebeb",
    width: 240,
  },
  settingsButton: {
    paddingRight: 20,
  },
  rowContainer: {
    flexDirection: "row",
  },
  decksContainer: {
    textAlign: "center",
    width: screen.width *0.9,
  },
  deckContainerButton: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 20,
    alignItems: "center",
    minHeight: screen.height / 6,
    borderColor: "#000000",
    width: screen.width*0.85,
  },
  miniButton: {
    height: (screen.height / 6) - 40,
  },
  deckTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  row: {
    flex: 1,
    justifyContent: "space-around",
  },
  deckTexts: {
    flexGrow: 2,
    maxHeight: "80%",
    marginLeft: "1%",
    maxWidth: "60%",
  },
  deckImg: {
    flexGrow: 1,
    maxWidth: 100,
    marginHorizontal: "4%",
    borderRadius: 10,
  },
  verticalEllipsis: {
    paddingHorizontal: 10,
  },
  ellipsisButton: {
    justifyContent: 'center',
    paddingRight: 30,
    width: 40,
    height: 40,
    paddingTop: 20,
  },
  noDecksContainer: {
    textAlign: "center",
    width: screen.width *0.9,
    marginTop: 70
  },
  noDecksText: {
    color: COLOURS.white,
    fontSize: 20,
    textAlign: "center",
  },  
  noGroupsText: {
    color: COLOURS.white,
    fontSize: 20,
    textAlign: "center",
  },
  createGroupButton: {
    backgroundColor: COLOURS.blue,
    textAlign: "center",
    marginTop: 30,
    marginHorizontal: '25%',
    paddingVertical: 8,
    borderRadius: 10
  },
  groupsButtonText: {
    color: COLOURS.white,
    fontSize: 17,
    textAlign: "center",
  },
  introModalContainer: {
    backgroundColor: '#99999965',
    height: screen.height - 55,
    width: screen.width,
    alignItems: 'center',
    paddingTop: screen.height/3,
  },
  modalBox: {
    width: screen.width - 50,
    
    backgroundColor: '#ffffff',
    alignItems:'center',
    borderRadius: 25,
    padding: 30,
  },
  modalText: {
    textAlign: 'center',
  },
  modalButton:{
    margin: 20,
    borderRadius: 25,
    backgroundColor: '#F89333',
    width: screen.width/6,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introModalContainer2: {
    backgroundColor: '#99999965',
    height: screen.height - 55,
    width: screen.width,
    alignItems: 'center',
    paddingTop: screen.height/1.5,  
  },
  imageSmall: {
    width: 40,
    height: 40,
  },
  leftArrow: {
    paddingRight: screen.width/4,  
  },
  filterButton: {
    height: 40,
    paddingLeft: 15,
    paddingTop: 5,
  },
  deckContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginBottom: 10,
    width: screen.width*0.9,
    borderRadius: 20,
  },
  searchBarContainer:{
    width: screen.width - screen.width/4,
    height: 40,
  },
  search: {
    borderRadius: 10,
    borderColor: '#00000040',
    backgroundColor: '#ffffff',
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    elevation: 5,
    height: 40,
    justifyContent: 'center',
  },
  searchText: {
    paddingLeft: 10,
    justifyContent: 'center',
  },
  modalButton2:{
    margin: 20,
    borderRadius: 25,
    backgroundColor: '#F89333',
    width: screen.width/4,
    height: screen.width/4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    padding: 5,
  },
  modalBox2: {
    width: screen.width - 50, 
    backgroundColor: '#ffffff',
    alignItems:'center',
    borderRadius: 25,
    justifyContent: 'center',
  },
  floatinBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});
