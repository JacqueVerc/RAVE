import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SecondScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Connexion réussie !</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RecordScreen')}>
                <Text style={styles.buttonText}>Ecran d'enregistrement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RAVEScreen')}>
                <Text style={styles.buttonText}>Utiliser RAVE</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    text: {
        fontSize: 18,
        marginBottom: 20,
        color: '#333',
    },
    button: {
        height: 50,
        width: '80%',
        backgroundColor: '#333',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
});

export default SecondScreen;
