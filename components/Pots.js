import React, { Component } from "react";
import {Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, SafeAreaView} from 'react-native';
import { Alert, Modal, Pressable } from "react-native";
import Carousel from 'react-native-snap-carousel';
import { db } from "../config";
import { storage } from "../config";

class Pots extends Component {
        constructor(props) {
        super(props);
        this.state = {
            plant_0_settings: {},
            plant_1_settings: {},
            plant_types: {},
            lst_plant_types: [],
            loading: true,
            profileImageUrl: '',
        }
        let imageRef = storage.ref('/picture1.jpg');
        imageRef.getDownloadURL().then((url) => {
            this.setState({profileImageUrl: url});
            console.log(url);
        })
        .catch((e) => console.log('getting downloadURL of image error => ', e));
    }
    
    componentDidMount() {
        db.ref('/settings').on('value', snapshot => {
            let data = snapshot.val() ? snapshot.val() : {};
            let settings = {...data};
            const {profileImageUrl} = this.state;

            this.setState({
                plant_0_settings: settings["plant_0"],
                plant_1_settings: settings["plant_1"],
                plant_types: settings["plant_watering_frequency"],
                loading: false,
                index:0,
                activeIndex:0,
                carouselItems: [
                    {
                        title:"Today",

                    },
                    {
                        title:"1 day ago",
                    },
                    {
                        title:"2 days ago",
                    },
                    {
                        title:"3 days ago",
                    },
                    {
                        title:"4 days ago",
                    },
                    {
                        title:"5 days ago",
                    },
                    {
                        title:"6 days ago",
                    },

                  ],
                modalVisible: false,
                activeIndex:0,

                plants: [{
                    id: 0,
                    name: settings['plant_0']['plant'],
                    heights: [2, 2.1, 2.3, 2.3, 2.4, null, null]
                },
                {
                    id: 2,
                    name: settings['plant_1']['plant'],
                    heights: [2, 2.1, 2.3, 2.3, 2.4, null, null]
                }]
            });
        });
    }


    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }




    _renderItem({item,index}){
        return (
          <View style={{
              backgroundColor:'floralwhite',
              borderRadius: 5,
              height: 250,
              padding: 20,
              marginLeft: 25,
              marginRight: 25, }}>
            <Text style={{fontSize: 20, textAlign: 'center', paddingBottom: 10, fontWeight: 'bold'}}>{item.title}</Text>
            <Image
                source={{uri : this.state.profileImageUrl}}
                style={{width: 175, height: 175, alignSelf: 'center'}}
                resizeMode='contain'
            />
            <Text>{item.text}</Text>
          </View>

        )
    }

    render() {
        const {modalVisible} = this.state;
        if (!this.state.loading) {
        return (
            <ScrollView contentContainerStyle={styles.container}>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        this.setModalVisible(!modalVisible);
                    }}
                    >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                        <SafeAreaView style={{flex: 1, backgroundColor:'transparent', paddingTop: 50, }}>
                        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center'}}>
                            <Carousel
                              style={{alignSelf: 'center'}}
                              layout={"default"}
                              ref={ref => this.carousel = ref}
                              data={this.state.carouselItems}
                              sliderWidth={300}
                              itemWidth={300}
                              renderItem={this._renderItem}
                              onSnapToItem = { index => this.setState({activeIndex:index}) } />
                        </View>
                        </SafeAreaView>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => this.setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </Pressable>
                        </View>
                    </View>
                </Modal>

                <View style={styles.topContainer}>
                    <Text style={{color: '#000000', fontSize: 45, fontWeight: 'bold'}}>
                        My{' '}
                        <Text style={{color: '#669850'}}>
                            Garden
                        </Text>
                    </Text>
                </View>
                {this.state.plants.map((plants) =>
                    <TouchableOpacity
                        key={plants.id}
                        onPress={() => this.setModalVisible(true)}
                        style={styles.pot}
                        underlayColor='#d4f0c7'
                    >
                        <Text style={{fontSize: 25, fontWeight: 'bold'}}>Pots {plants.id+1} {'&'} {plants.id+2}</Text>
                        <View style={{alignItems: 'center'}}>
                            <Image
                                source={require('../assets/pot-icon.png')}
                                style={{width: 175, height: 175}}
                                resizeMode='contain'
                            />
                        </View>
                        <View style={{
                            backgroundColor: '#ffffff',
                            borderRadius: 20,
                            borderWidth: 1,
                            borderColor: '#ffffff',
                            alignItems: 'center',
                            padding: 3
                        }}>
                            <Text style={{fontSize: 15}}>{plants.name}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                <View style={{height: 50}}></View>
            </ScrollView>
        );
    }
    else {
        return null;
    }
} }

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        alignItems: 'center'
    },
    topContainer: {
        marginVertical: 25,
        width: '90%'
    },
    pot: {
        flex: 1,
        height: 300,
        width: '90%',
        backgroundColor: '#e1eed3',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ffffff',
        padding: 20,
        margin: 5
    },
    potRow: {
        width: '95%',
        display: 'flex',
        flexDirection: 'row'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: 400
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
})

export default Pots;
