import { StyleSheet, Dimensions } from 'react-native';

const screen = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    
  },
  buttonContainer:{
    flex: 1,
    textAlign: 'center',
    width: screen.width * 6/7,
  },
  topHalf: {
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  bottomHalf: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    height: screen.height,
    paddingTop: 30,
  },
  picker: {

  }
})

