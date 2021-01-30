
import { StyleSheet, Dimensions} from 'react-native';

const screen = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: screen.height/12,
    paddingBottom: screen.height/6,
  },
  button: {
    flex: 1,
    borderRadius: 20,
    shadowRadius: 10,
    shadowColor: '#000000',
    elevation: 30,
    backgroundColor: '#f11111',
    width: screen.width/1.3,
    textAlign: "center",
    margin: 10,
    padding: 10,
    shadowOffset : { width: 1, height: 13},
    minHeight: 100,
  },
  headingText: {
    fontWeight: "bold",
    fontSize: 16,
    paddingRight: screen.width / 3.4,
    padding: 10,
  },
  welcomeText:{
    fontWeight: "bold",
    color: "#ffffff",
    alignSelf: 'flex-start',
    paddingLeft: screen.width /8,
    fontSize: 36,
    paddingBottom: 20,
  },
  subWelcomeText:{
    fontWeight: "bold",
    color: "#ffffff",
    alignSelf: 'flex-start',
    paddingLeft: screen.width /8,
    paddingBottom: 50,
    fontSize: 18,
  },
  image:{
    paddingBottom: 30,
    flex: 1,
    aspectRatio: 1.2, 
    resizeMode: 'contain',
  },
  rowContainer: {
    flexDirection: "row",
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
    height: screen.height/4,
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
    paddingRight: screen.width/1.6,
  }
});

