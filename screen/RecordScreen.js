import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const RecordScreen = (props) => {
    const [sound, setSound] = useState();
    const [recording, setRecording] = useState();
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [recordingUri, setRecordingUri] = useState();
    const [isRecording, setIsRecording] = useState(false);

    // S'assure qu'a l'arrivé sur la page, il n'y a pas d'audio en mémoire
    useEffect(() => {
        return sound ? () => {
            console.log('Unloading sound...');
            sound.unloadAsync();
        } : undefined;
    }, [sound]);

    // Lance le record si la permission est donnée par l'utilisateur
    const startRecording = async () => {
        try {
            if (permissionResponse.status !== 'granted') {
                await requestPermission();
            }
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    // Arrête le record
    const stopRecording = async () => {
        if (recording) {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecordingUri(uri);
            setRecording(undefined);
            setIsRecording(false);
        }
    };

    // Joue ce qui a été enregistré ou lève une erreurs s'il n'y a rien
    const playSound = async () => {
        if (recordingUri) {
            const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
            setSound(sound);
            await sound.playAsync();
        } else {
            Alert.alert('No recording found', 'Please record something first.');
        }
    };

    // Delet l'enregistrement s'il y en a un
    const deleteRecording = () => {
        if (recordingUri) {
            setRecordingUri(null);
            Alert.alert('Recording deleted', 'The recorded file has been deleted.');
        } else {
            Alert.alert('No recording found', 'Please record something first.');
        }
    };

    // Sauvegarde l'enregistrement dans le directory de l'app
    const saveRecording = async () => {
        if (recordingUri) {
            const fileName = `${FileSystem.documentDirectory}recording_${Date.now()}.m4a`;
            try {
                await FileSystem.moveAsync({
                    from: recordingUri,
                    to: fileName,
                });
                Alert.alert('Recording saved', `The recorded file has been saved to ${fileName}`);
                setRecordingUri(fileName);
            } catch (error) {
                Alert.alert('Error', 'An error occurred while saving the recording.');
                console.error(error);
            }
        } else {
            Alert.alert('No recording found', 'Please record something first.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Ecran d'enregistrement audio</Text>
            <TouchableOpacity
                style={[styles.button, { backgroundColor: isRecording ? '#d9534f' : '#5cb85c' }]}
                onPress={isRecording ? stopRecording : startRecording}
            >
                <Text style={styles.buttonText}>
                    {isRecording ? "Arrêter l'enregistrement" : "Commencer l'enregistrement"}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={playSound}>
                <Text style={styles.buttonText}>Rejouer l'enregistrement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={deleteRecording}>
                <Text style={styles.buttonText}>Supprimer l'enregistreement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={saveRecording}>
                <Text style={styles.buttonText}>Sauvegarder l'enregistreement</Text>
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

export default RecordScreen;
