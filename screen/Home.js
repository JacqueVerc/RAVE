import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import { useAppState } from '../AppState';

const Home = ({navigation}) => {
    const { ip, setIp, port, setPort } = useAppState();

    const handleConnect = () => {
        const url = `http://${ip}:${port}/`;
        console.log(ip);

        // Vérifie que la connexion se fait bien, si elle n'est pas bonne, on renvoie a la home
        fetch(url)
            .catch(error => {
                Alert.alert('Error', 'Connexion failed');
                console.error('Error fetching data:', error);
                navigation.navigate('Home');
            });
        navigation.navigate('ConnexionScreen');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>IP du serveur :</Text>
            <TextInput
                style={styles.input}
                placeholder="192.168.1.26"
                placeholderTextColor="#8E8E93"
                value={ip}
                onChangeText={setIp}
            />
            <Text style={styles.label}>Port du serveur :</Text>
            <TextInput
                style={styles.input}
                placeholder="8000"
                placeholderTextColor="#8E8E93"
                value={port}
                onChangeText={setPort}
            />
            <TouchableOpacity style={styles.button} onPress={handleConnect}>
                <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#F5F5F5',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    input: {
        height: 50,
        borderColor: '#D1D1D6',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 12,
        fontSize: 16,
        backgroundColor: '#FFFFFF',
        color: '#000',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    button: {
        height: 50,
        backgroundColor: '#333',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
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

export default Home;
