import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MapView, Location, Permissions, Constants } from 'expo'
import { Ionicons } from '@expo/vector-icons';
import Chronometer from './Chronometer'

const VIEW_PADDING = Constants.statusBarHeight

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
    parkings:[],
    direccion: 'Cargando dirección...',
    numeracion: 'Cargando numeración...'
  }

  _getAddressByCoords = (lat, lng) => {
    fetch(`http://bparking.beenary.cl/parking/nearby`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat,
        lng
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      responseJson.parkings.length >= 0 &&
      this.setState({
        parkings:responseJson.parkings
      })
      console.log(this.state.parkings)
    })
    .catch((error) => {
      console.error(error);
    })
  }

  _getLocation = (location) => {
    const { latitude, longitude } = location.coords
    this.setState({
      coords:{
        latitude,
        longitude
      }
    })
    console.log(location)
    this._getAddressByCoords(latitude, longitude)
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    const location = await Location.watchPositionAsync({
      enableHighAccuracy: true, distanceInterval: 0, timeInterval: 20000
    }, this._getLocation)
  };
  componentDidMount() {
    this._getLocationAsync()
  }

  render() {
    return (
      <View style={{flex:1, paddingTop: VIEW_PADDING}}>
        <MapView
          style={{flex:3}}
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDEDELTA,
            longitudeDelta: LONGITUDEDELTA
          }}
        >
          {this.state.parkings.map(marker => (
            <MapView.Marker
              key={marker.alias}
              coordinate={marker.coords}
              image={require('./parked-car.png')}
              title={`${marker.route}, ${marker.street_number}`}
              description={`Valor por minuto: $${marker.price}`}
            />
          ))}
          <MapView.Marker
              coordinate={this.state.coords}
              title={'Mi Posición'}
              description={`Hola Amego`}
            />
        </MapView>
        <View style={{flex:1, justifyContent: 'flex-start', backgroundColor:'#FAFAFA'}}>
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
