import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MapView, Location, Permissions, Constants } from 'expo'
import { Ionicons } from '@expo/vector-icons';
import Chronometer from './Chronometer'

const VIEW_PADDING = Constants.statusBarHeight

const MARKERS = [{
  latitude: -33.444033,
  longitude: -70.5791965
}]

const LATITUDE = -33.444033
const LONGITUDE = -70.5791965
const LATITUDEDELTA = 0.0922
const LONGITUDEDELTA = 0.0421

export default class App extends React.Component {
  state = {
    coords: {
      latitude: 0,
      longitude: 0
    },
    direccion: 'Cargando dirección...',
    numeracion: 'Cargando numeración...'
  }

  _getAddressByCoords = (lat, lng) => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyASmwYThmM1MqKZM2Gbwn8XxfNaUl_PI1k`)
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        coords: {
          latitude: lat,
          longitude: lng
        },
        direccion: responseJson.results[0].formatted_address,
        numeracion: responseJson.results[0].address_components[0].long_name
      })
      console.log(responseJson.results[0].address_components[0].long_name)
    })
    .catch((error) => {
      console.error(error);
    })
  }

  _getLocation = (location) => {
    const { latitude, longitude } = location.coords
    console.log(location)
    this._getAddressByCoords(latitude, longitude)
  }

  _getLocationAsync = async () => {
    const location = await Location.watchPositionAsync({
      enableHighAccuracy: true, distanceInterval: 0, timeInterval: 20000
    }, this._getLocation)
  };

  componentDidMount() {
    //this._getLocationAsync()
  }

  render() {
    return (
      <View style={{flex:1, paddingTop: VIEW_PADDING}}>
        <MapView
          style={{flex:2}}
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDEDELTA,
            longitudeDelta: LONGITUDEDELTA
          }}
        >
          {MARKERS.map(marker => (
            <MapView.Marker
              key={LATITUDE*LATITUDEDELTA}
              coordinate={marker}
              image={require('./parked-car.png')}
              //title={marker.title}
              //description={marker.description}
            />
          ))}
        </MapView>
        <View style={{flex:2, justifyContent: 'flex-start', backgroundColor:'#FAFAFA'}}>
          <Text style={{alignSelf:'center'}}>{JSON.stringify(MARKERS)}</Text>
          <Text style={{alignSelf:'center'}}>{this.state.direccion}</Text>
          <Text style={{alignSelf:'center'}}>{this.state.numeracion}</Text>
        </View>
        <View style={{flex:1, justifyContent: 'flex-start', backgroundColor:'#FAFAFA'}}>
          <Chronometer/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
