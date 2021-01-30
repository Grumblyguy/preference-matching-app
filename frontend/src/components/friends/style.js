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
    width: 240,
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
    flex: 1,
    textAlign: 'center',
    width: screen.width * 0.85,
    alignItems: 'center',
  },
  button: {
    flex: 1,
    borderRadius: 20,
    shadowRadius: 10,
    shadowColor: '#000000',
    backgroundColor: '#ffffff',
    alignItems: "center",
    margin: 10,
    shadowOffset : { width: 1, height: 13},
    minHeight: 30,
    borderColor: '#000000',
    flexDirection: 'row',
    padding: 10,
    width: screen.width * 0.8,
  },
  buttonText: {
    fontSize: 16,
    color: '#000000',
    paddingLeft: 30,
  },
  row: {
    flex: 1,
    justifyContent: "space-around",
  },
  modal: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginTop: screen.height/3,
    marginBottom: 50,
    minHeight: screen.height/5,
    margin: 40,
    justifyContent: 'center',
    borderRadius: 25,
    flexDirection: "row",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000aa',
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
  emptyText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    paddingTop: screen.height/10,
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
  modalButton2:{
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
    paddingTop: screen.height/2,
  },
  imageSmall: {
    width: 40,
    height: 40,  
  },
  leftArrow: {
    paddingLeft: screen.width/1.6,
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
  floatinBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});