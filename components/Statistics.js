import React, { Component } from 'react';
import {Button, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {db} from '../config';
import { initnotify, getToken, notify } from 'expo-push-notification-helper';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { Expo } from 'expo-server-sdk';

let ref = db.ref('/');
const TOTAL_VOLUME = 14748.4;

class Statistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            loading: true
        }
        //console.log(initnotify());
    }
      
    // registerForPushNotificationsAsync = async() => {
    //     const { status : existingStatus} = await Permissions.getAsync(
    //         Permissions.NOTIFICATIONS
    //     );
    //     let finalStatus = existingStatus;
    //     if (existingStatus !== 'granted') {
    //         const { status } = await Permissions.askAsync
    //         (Permissions.NOTIFICATIONS);
    //         finalStatus = status;
    //     }
    //     if (finalStatus !== 'granted') { 
    //         return;
    //     }
    // }

    // sendPushNotification = async () => {
    //     let t = await Notifications.getExpoPushTokenAsync();
    //     db.ref('token').update({
    //         token: t
    //     })
    //     let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
    //     // Create the messages that you want to send to clients
    //     let messages = [];
    //     // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    //     messages.push({
    //         to: this.state.data['token']['token']['data'],
    //         sound: 'default',
    //         body: 'This is a test notification',
    //         data: { withSome: 'data' },
    //     })
    //     let chunks = expo.chunkPushNotifications(messages);
    //     let tickets = [];
    //     (async () => {
    //     // Send the chunks to the Expo push notification service. There are
    //     // different strategies you could use. A simple one is to send one chunk at a
    //     // time, which nicely spreads the load out over time:
    //         for (let chunk of chunks) {
    //             try {
    //             let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
    //             console.log(ticketChunk);
    //             tickets.push(...ticketChunk);
    //             // NOTE: If a ticket contains an error code in ticket.details.error, you
    //             // must handle it appropriately. The error codes are listed in the Expo
    //             // documentation:
    //             // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    //             } catch (error) {
    //             console.error(error);
    //             }
    //         }
    //     })();

    //     // if (this.getPercentVolume() == 0) {
    //     //     notify(this.state.data['token']['token']['data'], "new message", "hello there how are you doing", "default")
    //     // }
    // }
    
    componentDidMount() {
        ref.on('value', snapshot => {
            let data = snapshot.val();
            let allData = {...data};
            this.setState({ 
                data: allData,
                loading: false
            });
        });
    }

    scheduleRefillNotif() {
        let time_left_0 = this.state.data['plants']['plant_0']['water_interval'];
        let time_left_1 = this.state.data['plants']['plant_1']['water_interval'];
        let volume_remaining = TOTAL_VOLUME;
        let total_time = 0;
        while (volume_remaining > time_left_0 && volume_remaining > time_left_1) {
            if (time_left_0 < time_left_1) {
                volume_remaining -= this.state.data['plants']['plant_0']['water_volume'];
                time_left_1 -= time_left_0;
                time_left_0 = this.state.data['plants']['plant_0']['water_interval'];
                total_time += time_left_0;
            } else {
                volume_remaining -= this.state.data['plants']['plant_1']['water_volume'];
                time_left_0 -= time_left_1;
                time_left_1 = this.state.data['plants']['plant_1']['water_interval'];
                total_time += time_left_1;
            }
        }
        total_time = total_time / 1000;
        const schedulingOptions = {
            content: {
              title: 'Refill Tank',
              body: 'Tank is Empty!',
              sound: true,
            },
            trigger: {
              seconds: total_time,
            },
          };

        // Notifications show only when app is not active.
        // (ie. another app being used or device's screen is locked)
        Notifications.scheduleNotificationAsync(
            schedulingOptions,
        );
    }

    scheduleFertilizerNotif0() {
        let total_time = 0;
        if (this.state.data['settings']['plant_0']['age'] == 'sapling') {
            total_time = 7 * 24 * 60 * 60;
        } else {
            total_time = 14 * 24 * 60 * 60;
        }
        const schedulingOptions = {
            content: {
              title: 'Fertilize Pots 1 & 2',
              body: 'Time to Fertilize!',
              sound: true,
            },
            trigger: {
              seconds: total_time,
            },
          };

        // Notifications show only when app is not active.
        // (ie. another app being used or device's screen is locked)
        Notifications.scheduleNotificationAsync(
            schedulingOptions,
        );
    }

    scheduleFertilizerNotif1() {
        let total_time = 0;
        if (this.state.data['settings']['plant_1']['age'] == 'sapling') {
            total_time = 7 * 24 * 60 * 60;
        } else {
            total_time = 14 * 24 * 60 * 60;
        }
        const schedulingOptions = {
            content: {
              title: 'Fertilize Pots 3 & 4',
              body: 'Time to Fertilize!',
              sound: true,
            },
            trigger: {
              seconds: total_time,
            },
          };

        // Notifications show only when app is not active.
        // (ie. another app being used or device's screen is locked)
        Notifications.scheduleNotificationAsync(
            schedulingOptions,
        );
    }

    getPercentVolume() {
        let diff_0 = this.state.data['plants']['plant_0']['last_watered'] - this.state.data['stats']['last_refilled'];
        let diff_1 = this.state.data['plants']['plant_1']['last_watered'] - this.state.data['stats']['last_refilled'];
        let water_0 = 0;
        let water_1 = 0;
        if (diff_0 > 0) {
            water_0 = (1 + Math.floor(diff_0 / this.state.data['plants']['plant_0']['water_interval'])) * this.state.data['plants']['plant_0']['water_volume'] * 2;
        }
        if (diff_1 > 0) {
            water_1 = (1 + Math.floor(diff_1 / this.state.data['plants']['plant_1']['water_interval'])) * this.state.data['plants']['plant_1']['water_volume'] * 2;
        }
        return Math.max(Math.floor((TOTAL_VOLUME - water_0 - water_1) / TOTAL_VOLUME * 100), 0)
        // console.log(Date.now())
        // return performance.now();
    }
    getDaysLeft0() {
        let timeElapsed = Date.now() - this.state.data['stats']['last_fertilized_0'];
        if (this.state.data['settings']['plant_0']['age'] == 'sapling') {
            return 7 - Math.floor(timeElapsed / 1000 / 60 / 60 / 24);
        } else {
            return 14 - Math.floor(timeElapsed / 1000 / 60 / 60 / 24);
        }
        return null;
    }
    getDaysLeft1() {
        let timeElapsed = Date.now() - this.state.data['stats']['last_fertilized_1'];
        if (this.state.data['settings']['plant_1']['age'] == 'sapling') {
            return 7 - Math.floor(timeElapsed / 1000 / 60 / 60 / 24);
        } else {
            return 14 - Math.floor(timeElapsed / 1000 / 60 / 60 / 24);
        }
        return null;
    }

    render() {
        if (!this.state.loading) {
            return (
                <ScrollView contentContainerStyle={styles.container}>
                    
                    {/* Tank */}

                    <View style={styles.topContainer}>
                    <Text style={{color: '#000000', fontSize: 45, fontWeight: 'bold'}}>
                        My{' '}
                        <Text style={{color: '#669850'}}>
                            Statistics
                        </Text>
                    </Text>
                    </View>
                    <View style={styles.waterContainer}>
                        <View style={styles.textContainer}>
                            <Text style={styles.waterText}>Water</Text>
                        </View>
                        <View style={styles.imageContainer}>
                            <Image
                                source={require('../assets/water-bucket.png')}
                                style={{flex: 1}}
                                resizeMode='contain'
                            />
                            <ImageBackground source={require('../assets/blue-circle.png')} style={{flex: 1, width: 125, height: 125, resizeMode: 'center'}}>
                                <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={this.getPercentVolume() == 0 ? styles.numberTextRed : styles.numberText}>
                                        {this.getPercentVolume()}%
                                    </Text>
                                </View>
                            </ImageBackground>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={() =>
                                    {db.ref('/stats').update({
                                        last_refilled: Date.now()
                                    })
                                    this.scheduleRefillNotif()}
                                }
                                style={styles.refillButton}
                                underlayColor='#5B98BB'
                                >
                                <Text style={styles.refillText}>Refill</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    {/* Fertilizer 1 & 2 */}

                    <View style={styles.waterContainer}>
                        <View style={styles.textContainer}>
                            <View style={{flex: 1}}>
                                <Text style={styles.waterText}>Fertilizer</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={styles.potText}>Pots 1 {'&'} 2</Text>
                            </View>
                        </View>
                        <View style={styles.imageContainer}>
                            <Image
                                source={require('../assets/dirt.png')}
                                style={{flex: 1}}
                                resizeMode='contain'
                            />
                            <ImageBackground source={require('../assets/green-circle.png')} style={{flex: 1, width: 125, height: 125, resizeMode: 'center'}}>
                                <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={this.getDaysLeft0() == 0 ? styles.numberTextRed : styles.numberText}>
                                        {this.getDaysLeft0()} Days
                                    </Text>
                                </View>
                            </ImageBackground>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={() =>
                                    {db.ref('/stats').update({
                                        last_fertilized_0: Date.now()
                                    })
                                    this.scheduleFertilizerNotif0()}
                                }
                                style={styles.fertilizerButton}
                                underlayColor='#5B98BB'
                                >
                                <Text style={styles.fertilizerText}>Fertilize</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Fertilizer 3 & 4 */}

                    <View style={styles.waterContainer}>
                        <View style={styles.textContainer}>
                            <View style={{flex: 1}}>
                                <Text style={styles.waterText}>Fertilizer</Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={styles.potText}>Pots 3 {'&'} 4</Text>
                            </View>
                        </View>
                        <View style={styles.imageContainer}>
                            <Image
                                source={require('../assets/dirt.png')}
                                style={{flex: 1}}
                                resizeMode='contain'
                            />
                            <ImageBackground source={require('../assets/green-circle.png')} style={{flex: 1, width: 125, height: 125, resizeMode: 'center'}}>
                                <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={this.getDaysLeft1() == 0 ? styles.numberTextRed : styles.numberText}>
                                        {this.getDaysLeft1()} Days
                                    </Text>
                                </View>
                            </ImageBackground>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={() =>
                                    {db.ref('/stats').update({
                                        last_fertilized_1: Date.now()
                                    })
                                    this.scheduleFertilizerNotif1()}
                                }
                                style={styles.fertilizerButton}
                                underlayColor='#5B98BB'
                                >
                                <Text style={styles.fertilizerText}>Fertilize</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                
            );
        } else {
            return null;
        }
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    topContainer: {
        marginVertical: 25,
        width: '90%'
    },
    waterContainer: {
        display: 'flex',
        justifyContent: 'space-evenly',
        height: 300,
        width: '90%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ffffff',
        backgroundColor: '#ffffff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 25
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: 20
    },
    waterText: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    potText: {
        paddingTop: 10, 
        paddingLeft: 60,
        fontWeight: 'bold',
        fontSize: 18,
        color: 'grey'
    },
    imageContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    refillButton: {
        width: '50%',
        height: 50,
        backgroundColor:'#5B98BB',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    refillText: {
        fontSize: 20,
        fontWeight: 'bold',
        color:'#ffffff'
    },
    fertilizerButton: {
        width: '50%',
        height: 50,
        backgroundColor:'#80a855',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    fertilizerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color:'#ffffff'
    },
    numberText: {
        fontSize: 25,
        fontWeight: 'bold',
        paddingRight: 50
    },
    numberTextRed: {
        fontSize: 25,
        fontWeight: 'bold',
        paddingRight: 50,
        color: '#ff0000'
    }
})

export default Statistics;