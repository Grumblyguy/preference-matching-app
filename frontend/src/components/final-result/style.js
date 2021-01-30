import { StyleSheet, Dimensions } from 'react-native';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  winningHeaderText : {
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
    flex: 0.1,
    marginTop: 20
  },
  card: {
    flex: 1,
    width: 320,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    flex: 0.3,
    paddingVertical: 10
  },
  description: {
    fontSize: 18,
    flex: 0.4,
    marginTop: 20,
    paddingHorizontal: 40,
    textAlign: 'center'
  },
  cardImage: {
    width: 220,
    flex: 1,
    resizeMode: 'contain',
  },
  cardContainer: {
    flex: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsContainer: {
    flex: 0.2,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginTop: 40
  },
  resultsButton : {
    backgroundColor: '#3076FF',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    paddingHorizontal: 10,
    borderRadius: 25,
    padding: 10,
  },
  resultsText: {
    color: 'white',
    fontSize: 18
  },
  decksButton: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    paddingHorizontal: 10,
    borderRadius: 25,
    padding: 10,
  },
  decksText: {
    color: '#3076FF',
    fontSize: 18
  }
});
