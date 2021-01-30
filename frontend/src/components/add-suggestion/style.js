import { StyleSheet, Dimensions } from 'react-native';
const screen = Dimensions.get("window");

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  imageContainer: {
    width: screen.width,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  description: {
    width: screen.width,
  },
  inputContainer: {
    width: screen.width,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  imageButton:{
    backgroundColor: 'orange',
    width: screen.width/1.5,
    borderRadius: 25,
    padding: 10,
    elevation: 20,
  },
  title: {
    color: 'white',
    paddingBottom: 20,
    fontWeight: 'bold',
    fontSize: 16,
    paddingLeft: 20,
  },
  titleInput: {
    borderColor: 'grey',
    borderWidth: 1,
    width: screen.width - 40,
    borderRadius: 10,
    backgroundColor: '#00000020',
    paddingLeft: 10,
  },
  descriptionInput:{
    borderColor: 'grey',
    borderWidth: 1,
    width: screen.width - 40,
    borderRadius: 10,
    height: 50,
    margin: 20,
    backgroundColor: '#00000020',
    paddingLeft: 10,
  },
  submitButton: {
    backgroundColor: '#ffffff90',
    borderRadius: 15,
    padding: 15,
    width: screen.width/2,
    alignItems: 'center',
  },
  uploadedImg: {
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingTop: 30, 
    paddingBottom: 10
  },
  defaultImg: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingTop: 15, 
    paddingBottom: 20
  }
});