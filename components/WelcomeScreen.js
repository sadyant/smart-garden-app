import React from 'react';
import {Button, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const WelcomeScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            <Text style={{color: '#000000', fontSize: 45, fontWeight: 'bold', justifyContent: "flex-end"}}>
                Smart
                <Text style={{color: '#669850'}}> Garden</Text>
            </Text>

            <Image
                source={require('../assets/gardening-lady.png')}
                style={styles.image}
                resizeMode='contain'
            />
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('Home')
                }
                style={styles.growButton}
                underlayColor='#ffffff'
                >
                <Text style={styles.growText}>Grow</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: '#ffffff',
        width: '100%'
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50%',
        paddingTop: 200,
        paddingBottom: 200
    },

    growButton: {
        width: '50%',
        height: 50,
        backgroundColor:'#669850',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    growText: {
        fontSize: 20,
        fontWeight: 'bold',
        color:'#ffffff'
    },
    image: {
        width: '60%',
        height: '60%'
    }
})

export default WelcomeScreen;
