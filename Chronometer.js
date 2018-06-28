import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MapView, Location, Permissions, Constants } from 'expo'
import { Entypo } from '@expo/vector-icons';

const formattedSeconds = (sec) => Math.floor(sec / 60) + ':' + ('0' + sec % 60).slice(-2)

export default class Chronometer extends Component {
    constructor(props) {
        super()
        this.state = { 
            secondsElapsed: 0, 
            laps: [],
            lastClearedIncrementer: null,
            check: false
        }
        this.incrementer = null
    }

    _handleStartClick = () => {
        console.log('start')
        this.setState({
            check: true
        })
        this.incrementer = setInterval(() =>
          this.setState({
            secondsElapsed: this.state.secondsElapsed + 1
          })
        , 1000)
    }

    _handleStopClick = () => {
        this.setState({
            check: false
        })
        clearInterval(this.incrementer);
        this.setState({
            lastClearedIncrementer: this.incrementer
        });
        console.log(this.state.lastClearedIncrementer)
    }

    render() {
        return(
            <View style={{
                flex: 1,
                justifyContent: 'space-between',
                flexDirection:'row',
                alignItems:'flex-start',
                paddingHorizontal: 10}}>
                <TouchableOpacity onPress={this._handleStartClick} style={{elevation: 1, borderRadius:30}}>
                    <Text style={{
                        //alignSelf:',
                        textAlign:'center',
                        fontSize:35, 
                        letterSpacing:5, 
                        paddingHorizontal:70,
                        }}>
                            {formattedSeconds(this.state.secondsElapsed)}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={!this.state.check ? this._handleStartClick : this._handleStopClick} style={{elevation: 1, borderRadius:30}}>
                    <Text style={{
                        //alignSelf:',
                        textAlign:'center',
                        fontSize:35,
                        paddingHorizontal:20
                        //letterSpacing:5, 
                        }}>
                            {!this.state.check ? 'GO!' : 'Stop'}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}