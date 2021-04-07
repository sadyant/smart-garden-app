import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View, Platform} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {db} from "../config";

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            waters: [],
            dates: {},
            loading: true
        }
    }

    componentDidMount() {
        db.ref("/").on("value", snapshot => {
            let data = snapshot.val() ? snapshot.val() : {};
            let info = {...data};
            let items = []
            for (let i = 1; i <= 31; i++) {
              items.push('2021-' + toString(new Date().getMonth() + 1) + '-' + i)
            }
            this.setState({
                waters: [{
                    id: 1,
                    last_watered: info["plants"]["plant_0"]["last_watered"],
                    interval: info["plants"]["plant_0"]["water_interval"],
                    plant: info["settings"]["plant_0"]["plant"]
                },
                {
                    id: 2,
                    last_watered: info["plants"]["plant_1"]["last_watered"],
                    interval: info["plants"]["plant_1"]["water_interval"],
                    plant: info["settings"]["plant_1"]["plant"]
                }],
                dates: items,
                loading: false
            })
        })
    }

    getFrequency(age, plant_name) {
        return new Promise(resolve => {
            setTimeout(() => {
                if (age == "plant") {
                    switch(this.state.plant_types[plant_name]) {
                        case "very low":
                            resolve("1209600000")
                        case "low":
                            resolve("604800000")
                        case "moderate":
                            resolve("302400000")
                    }
                }
                else if (age == "sapling") { // age == "sapling"
                    switch(this.state.plant_types[plant_name]) {
                        case "very low":
                            resolve("604800000")
                        case "low":
                            resolve("302400000")
                        case "moderate":
                            resolve("151200000")
                    }
                }
            }, 1000)
        })
      }

    getDate(milliseconds) {
        const dateObject = new Date(milliseconds)
        return dateObject.toLocaleDateString("en-US")
    }

    getTime(milliseconds) {
        const dateObject = new Date(milliseconds)
        return dateObject.toLocaleTimeString()
    }

    render() {
        if (!this.state.loading) {
            return (
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.topContainer}>
                        <Text style={{color: '#000000', fontSize: 35, fontWeight: 'bold'}}>
                            Welcome back!
                        </Text>
                    </View>
                    <View style={styles.middleContainer}>
                        <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                            Upcoming Waters
                        </Text>
                        <View style={styles.waterContainer}>

                        {this.state.waters.map(wateringInfo => (
                            <View key={wateringInfo.id} style={styles.waterNotif}>
                                <View style={{display: 'flex', flexDirection: 'row'}}>
                                    <Text style={{flex: 1, padding: 20}}>
                                        <Text style={{fontSize: 24, fontWeight: 'bold'}}>
                                            {this.getDate(parseInt(wateringInfo.last_watered) + parseInt(wateringInfo.interval))}{'\n'}
                                        </Text>
                                        <Text style={{fontSize: 18, color: "#666666"}}>
                                            {this.getTime(parseInt(wateringInfo.last_watered) + parseInt(wateringInfo.interval))}
                                        </Text>
                                    </Text>
                                    <Text style={{flex: 1, padding: 20}}>
                                        <Text style={{fontSize: 20, fontWeight: "bold"}}>
                                            Watering{'\n'}
                                        </Text>
                                        <Text style={{fontSize: 18, color: "#666666"}}>
                                            {wateringInfo.plant.replace(/_/g, " ")}
                                        </Text>
                                    </Text>
                                    <View style={styles.CircleShape} />

                                </View>
                            </View>
                        ))}

                        </View>
                    </View>
                    <View style={styles.bottomContainer}>
                        <Calendar
                            markedDates={{
                                dates: {marked : true, selectedColor: 'blue'}
                            }}
                        />

                    </View>
                </ScrollView>
            );
        }
        else {
            return null
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    topContainer: {
        paddingTop: 50,
        width: '90%'
    },
    middleContainer: {
        paddingTop: 50,
        width: '90%'
    },
    bottomContainer: {
        paddingTop: 25,
        paddingBottom: 50,
        width: '90%'
    },
    waterContainer: {
        marginTop: 10
    },
    waterNotif: {
        backgroundColor: '#d4f0c7',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ffffff',
        marginTop: 10
    },
    CircleShape: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'deepskyblue',
      justifyContent: 'center',
      paddingTop: 50,
      paddingBottom: 50
    },
    dot1: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'deepskyblue',
      justifyContent: 'center',
    },
    CircleShape1: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'slateblue',
      justifyContent: 'center',
      paddingTop: 50,
      paddingBottom: 50
    },
    dot1: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'slateblue',
      justifyContent: 'center',
    }
})

export default Home;