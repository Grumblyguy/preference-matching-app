import { StyleSheet, Dimensions } from 'react-native';
const screen = Dimensions.get("window");

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F89333',
    alignItems: 'center',
    paddingTop: 20,
    },
  groupTitle: {
    paddingTop: 30,
    fontSize: 30,
    color: '#ffffff',
    paddingBottom: 40,
    fontWeight: 'bold',
    },
  searchContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: screen.width,
    height: screen.height,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    },
  memberText: {
    fontWeight: 'bold',
    color: '#000000',
    paddingTop: 30,
    paddingLeft: screen.width / 10,
    fontSize: 20,
    },
  buttonContainer: {
    flex: 1,
    paddingLeft: screen.width / 10,
    paddingTop: 10,
    paddingRight: screen.width/10,
  },
  row: {
    flex: 1,
    justifyContent: "space-around",
  },
  button:{
    flex: 1,
    height: 60,
    paddingTop: 10,
    flexDirection: 'row',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingTop: 10,
    paddingLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    borderRadius: 30,
    borderColor: '#000',
    backgroundColor: '#ffffff',
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    elevation: 5,
    maxHeight: 40,
  },
  searchText: {
    paddingLeft: 10,
  },
  textInput: {
    paddingTop: 30,
    paddingBottom: 40,
    alignItems: 'center',
  },
  inputText: {
    fontSize: 32,
    color: '#ffffff',
  },
});