import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View, TextInput} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {db} from '../config';

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            plant_0_settings: {},
            plant_1_settings: {},
            plant_types: {},
            lst_plant_types: [],
            loading: true
        }
    }
    componentDidMount() {
        db.ref('/settings').on('value', snapshot => {
            let data = snapshot.val() ? snapshot.val() : {};
            let settings = {...data};
            let lst = []
            for (key in settings["plant_watering_frequency"]) {
                lst.push({label: key.replace(/_/g, " "), value: key})
            }
            this.setState({
                plant_0_settings: settings["plant_0"],
                plant_1_settings: settings["plant_1"],
                plant_types: settings["plant_watering_frequency"],
                lst_plant_types: lst,
                loading: false
            });
        });
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

    async updateFrequency(age, plant_name, path) {
        let freq = await this.getFrequency(age, plant_name)
        db.ref(path).update({
            water_interval: freq
        })
    }

    updateVolume(diameter, height, path) {
        db.ref(path).update({
            water_volume: ((diameter/2)**2 * Math.PI * height).toString()
        })
    }

    updatePlant(path, plant_name) {
        db.ref(path).update({
            plant: plant_name
        })
        if (path == "/settings/plant_0") {
            this.updateFrequency(this.state.plant_0_settings["age"], plant_name, "/plants/plant_0");
        }
        else { // path == "/settings/plant_1"
            this.updateFrequency(this.state.plant_1_settings["age"], plant_name, "/plants/plant_1");
        }
    }

    updateAge(path, age) {
        db.ref(path).update({
            age: age
        })
        if (path == "/settings/plant_0") {
            this.updateFrequency(age, this.state.plant_0_settings["plant"], "/plants/plant_0");
        }
        else { // path == "/settings/plant_1"
            this.updateFrequency(age, this.state.plant_1_settings["plant"], "/plants/plant_1");
        }
    }

    updateDiameter(path, diameter) {
        db.ref(path).update({
            diameter: diameter
        })
        if (path == "/settings/plant_0") {
            this.updateVolume(diameter, this.state.plant_0_settings["height"], "/plants/plant_0")
        }
        else {
            this.updateVolume(diameter, this.state.plant_1_settings["height"], "/plants/plant_1")
        }
    }

    updateHeight(path, height) {
        db.ref(path).update({
            height: height
        })
        if (path == "/settings/plant_0") {
            this.updateVolume(this.state.plant_0_settings["diameter"], height, "/plants/plant_0")
        }
        else {
            this.updateVolumen(this.state.plant_1_settings["diameter"], height, "/plants/plant_1")
        }
    }

    render () {
        if (!this.state.loading) {
            return (
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={{fontSize: 45, fontWeight: 'bold', alignSelf: "baseline"}}>
                        Settings
                    </Text>
                    <View style={styles.potContainer}>
                    <Text style={styles.potText}>Pot 1 and 2</Text>
                    <Text style={styles.potInfo}>Plant Type</Text>
                    <View
                      style={{
                        ...(Platform.OS !== 'android' && {
                          zIndex:99999, height:40
                        })
                      }}
                      >
                    <DropDownPicker
                        searchable={true}
                        searchablePlaceholder="Search for an item"
                        defaultValue={this.state.plant_0_settings["plant"]}
                        items={this.state.lst_plant_types}
                        onChangeItem={plant => {
                            this.setState(prevState => ({
                                plant_0_settings: {
                                    ...prevState.plant_0_settings,
                                    "plant": plant["value"]
                                }
                            }), this.updatePlant.bind(this, "/settings/plant_0", plant["value"]))
                        }}
                        containerStyle={{height: 40, width: 300}}
                        style={{backgroundColor: '#fafafa'}}
                        itemStyle={{
                            justifyContent: 'space-between'
                        }}
                        dropDownStyle={{backgroundColor: '#fafafa'}}
                    />
                    </View>

                    <View
                      style={{
                        ...(Platform.OS !== 'android' && {
                          zIndex:9999
                        })
                      }}
                      >
                    <Text style={styles.potInfo}>Age</Text>
                    <DropDownPicker
                        defaultValue={this.state.plant_0_settings["age"]}
                        items={[
                            {label: "sapling", value: "sapling"},
                            {label: "plant", value: "plant"},
                        ]}
                        onChangeItem={age => {
                            this.setState(prevState => ({
                                "plant_0_settings": {
                                    ...prevState.plant_0_settings,
                                    "age": age["value"]
                                }
                            }), this.updateAge.bind(this, "/settings/plant_0", age["value"]))
                        }}
                        containerStyle={{height: 40, width: 300}}
                        style={{backgroundColor: '#fafafa'}}
                        itemStyle={{
                            justifyContent: 'space-between'
                        }}
                        dropDownStyle={{backgroundColor: '#fafafa'}}
                    />
                    </View>

                    <View
                      style={{
                        ...(Platform.OS !== 'android' && {
                          zIndex:999
                        })
                      }}
                      >
                    <Text style={styles.potInfo}>Pot Diameter (cm)</Text>
                    <DropDownPicker
                        defaultValue={this.state.plant_0_settings["diameter"]}
                        items={[
                            {label: "6", value: "6"},
                            {label: "7", value: "7"},
                            {label: "8", value: "8"},
                            {label: "9", value: "9"},
                            {label: "10", value: "10"},
                            {label: "11", value: "11"},
                            {label: "12", value: "12"},
                            {label: "13", value: "13"},
                            {label: "14", value: "14"}
                        ]}
                        onChangeItem={diameter => {
                            this.setState(prevState => ({
                                "plant_0_settings": {
                                    ...prevState.plant_0_settings,
                                    "diameter": diameter["value"]
                                }
                            }), this.updateDiameter.bind(this, "/settings/plant_0", diameter["value"]))
                        }}
                        containerStyle={{height: 40, width: 300}}
                        style={{backgroundColor: '#fafafa'}}
                        itemStyle={{
                            justifyContent: 'space-between'
                        }}
                        dropDownStyle={{backgroundColor: '#fafafa'}}
                    />
                    </View>


                    <Text style={styles.potInfo}>Pot Height</Text>
                    <View
                     style={{
                       ...(Platform.OS !== 'android' && {
                         zIndex:99
                       })
                     }}
                     >
                    <DropDownPicker
                        dropDownMaxHeight={70}
                        defaultValue={this.state.plant_0_settings["height"]}
                        items={[
                            {label: "6", value: "6"},
                            {label: "7", value: "7"},
                            {label: "8", value: "8"},
                            {label: "9", value: "9"},
                            {label: "10", value: "10"},
                            {label: "11", value: "11"},
                            {label: "12", value: "12"},
                            {label: "13", value: "13"},
                            {label: "14", value: "14"}
                        ]}
                        onChangeItem={height => {
                            this.setState(prevState => ({
                                "plant_0_settings": {
                                    ...prevState.plant_0_settings,
                                    "height": height["value"]
                                }
                            }), this.updateHeight.bind(this, "/settings/plant_0", height["value"]))
                        }}
                        containerStyle={{height: 40, width: 300}}
                        style={{backgroundColor: '#fafafa'}}
                        itemStyle={{
                            justifyContent: 'space-between'
                        }}
                        dropDownStyle={{backgroundColor: '#fafafa'}}
                    />
                    </View>

                    </View>

                    <View style={styles.potContainer}>
                    <Text style={styles.potText}>Pot 3 and 4</Text>
                    <Text style={styles.potInfo}>Plant Type</Text>
                    <View
                      style={{
                        ...(Platform.OS !== 'android' && {
                          zIndex:99999
                        })
                      }}
                      >
                    <DropDownPicker
                        searchable={true}
                        searchablePlaceholder="Search for an item"
                        defaultValue={this.state.plant_1_settings["plant"]}
                        items={this.state.lst_plant_types}
                        onChangeItem={plant => {
                            this.setState(prevState => ({
                                plant_1_settings: {
                                    ...prevState.plant_1_settings,
                                    "plant": plant["value"]
                                }
                            }), this.updatePlant.bind(this, "/settings/plant_1", plant["value"]))
                        }}
                        containerStyle={{height: 40, width: 300}}
                        style={{backgroundColor: '#fafafa'}}
                        itemStyle={{
                            justifyContent: 'space-between'
                        }}
                        dropDownStyle={{backgroundColor: '#fafafa'}}
                    />
                    </View>

                    <View
                      style={{
                        ...(Platform.OS !== 'android' && {
                          zIndex:9999
                        })
                      }}
                      >
                    <Text style={styles.potInfo}>Age</Text>
                    <DropDownPicker
                        defaultValue={this.state.plant_1_settings["age"]}
                        items={[
                            {label: "sapling", value: "sapling"},
                            {label: "plant", value: "plant"},
                        ]}
                        onChangeItem={age => {
                            this.setState(prevState => ({
                                "plant_1_settings": {
                                    ...prevState.plant_1_settings,
                                    "age": age["value"]
                                }
                            }), this.updateAge.bind(this, "/settings/plant_1", age["value"]))
                        }}
                        containerStyle={{height: 40, width: 300}}
                        style={{backgroundColor: '#fafafa'}}
                        itemStyle={{
                            justifyContent: 'space-between'
                        }}
                        dropDownStyle={{backgroundColor: '#fafafa'}}

                    />
                    </View>

                    <View
                      style={{
                        ...(Platform.OS !== 'android' && {
                          zIndex:999
                        })
                      }}
                      >
                    <Text style={styles.potInfo}>Pot Diameter (cm)</Text>
                    <DropDownPicker
                        defaultValue={this.state.plant_1_settings["diameter"]}
                        items={[
                            {label: "6", value: "6"},
                            {label: "7", value: "7"},
                            {label: "8", value: "8"},
                            {label: "9", value: "9"},
                            {label: "10", value: "10"},
                            {label: "11", value: "11"},
                            {label: "12", value: "12"},
                            {label: "13", value: "13"},
                            {label: "14", value: "14"}
                        ]}
                        onChangeItem={diameter => {
                            this.setState(prevState => ({
                                "plant_1_settings": {
                                    ...prevState.plant_1_settings,
                                    "diameter": diameter["value"]
                                }
                            }), this.updateDiameter.bind(this, "/settings/plant_1", diameter["value"]))
                        }}
                        containerStyle={{height: 40, width: 300}}
                        style={{backgroundColor: '#fafafa'}}
                        itemStyle={{
                            justifyContent: 'space-between'
                        }}
                        dropDownStyle={{backgroundColor: '#fafafa'}}
                    />
                    </View>

                    <View
                      style={{
                        ...(Platform.OS !== 'android' && {
                          zIndex:99
                        })
                      }}
                      >
                    <Text style={styles.potInfo}>Pot Height</Text>
                    <DropDownPicker
                        dropDownMaxHeight={70}
                        defaultValue={this.state.plant_1_settings["height"]}
                        items={[
                            {label: "6", value: "6"},
                            {label: "7", value: "7"},
                            {label: "8", value: "8"},
                            {label: "9", value: "9"},
                            {label: "10", value: "10"},
                            {label: "11", value: "11"},
                            {label: "12", value: "12"},
                            {label: "13", value: "13"},
                            {label: "14", value: "14"}
                        ]}
                        onChangeItem={height => {
                            this.setState(prevState => ({
                                "plant_0_settings": {
                                    ...prevState.plant_1_settings,
                                    "height": height["value"]
                                }
                            }), this.updateHeight.bind(this, "/settings/plant_1", height["value"]))
                        }}
                        containerStyle={{height: 40, width: 300}}
                        style={{backgroundColor: '#fafafa'}}
                        itemStyle={{
                            justifyContent: 'space-between'
                        }}
                        dropDownStyle={{backgroundColor: '#fafafa'}}
                    />
                    </View>

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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 30,
        backgroundColor: "#ffffff"
    },
    potText: {
        paddingTop: 0,
        fontSize: 30,
        fontWeight: 'bold',
        color:'#000000',
        alignSelf: "stretch",
    },
    potInfo: {
        paddingTop: 37,
        paddingBottom: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color:'#000000',
        alignSelf: "stretch",
    },
    potContainer: {
        height: 550,
        marginTop: 10,
        marginBottom: 30,
        padding: 20,
        backgroundColor:'#ffffff',
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: '#C1C1C1',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000000",
        shadowOffset: {
        height: 1,
        width: 0.5}
    }
})

export default Settings;
