import { StyleSheet, Dimensions} from 'react-native';

const screen = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
  },
  headerStyle: {
    backgroundColor: '#F89333',
    elevation: 40,
  },
  drawerStyle: {
    backgroundColor: '#edebeb',
    width: screen.width * 0.9,
  }, 
  image: {
    
  },
  settingsButton:{
    paddingRight: 20,
  },
  rowContainer:{
    flexDirection: "row",
  },
  buttonContainer:{
    textAlign: 'center',
    width: screen.width * 0.9,
    alignItems: 'center',
    height: screen.height *0.85,
  },
  button: {
    flex: 1/2,
    borderRadius: 20,
    shadowRadius: 10,
    shadowColor: '#000000',
    backgroundColor: '#ffffff',
    width: screen.width/1.3,
    alignItems: "center",
    margin: 10,
    paddingTop: 30,
    shadowOffset : { width: 1, height: 13},
    minHeight: 130,
    borderColor: '#000000',
  },
  buttonText: {
    fontSize: 16,
    color: '#000000',
    paddingTop: 10,
    textAlign: 'center',
  },
  row: {
    flex: 1,
    justifyContent: "space-around",
  },
  emptyText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    paddingTop: 70,
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
    paddingLeft: screen.width/4, 
  },
  filterButton: {
    height: 40,
    paddingLeft: 15,
    paddingTop: 5,
  },
  filterButtonContainer: {
    
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
  floatingButton: {
    width: 70,
    height: 70,
    zIndex: 2,
  },
  floatinBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  }
});