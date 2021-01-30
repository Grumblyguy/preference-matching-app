import { StyleSheet, Dimensions} from 'react-native';

const screen = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  cardContainer: {
    borderRadius: 20,
    shadowRadius: 10,
    shadowColor: '#000000',
    elevation: 50,
    backgroundColor: '#ffffff',
    margin: 10,
    shadowOffset : { width: 1, height: 13},
    minHeight: 30,
    borderColor: '#000000',
    flexDirection: 'row',
    padding: 10,
    alignItems: 'flex-start'
  },
  cardDetails: {
    marginLeft: 15,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 8 
  },
  cardPercentage: {
    marginRight: 4,
    marginTop: 2.5,
  },
  cardImage: {
    width: 40,
    height: 40,
    marginLeft: 4
  },
  flatlistContainer:{
    flex: 1,
    textAlign: 'center',
    width: screen.width * 0.9,
  },
});