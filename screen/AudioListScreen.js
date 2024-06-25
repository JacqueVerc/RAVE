import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialIcons';



const AudioListScreen = ({navigation}) => {
    const [recordings, setRecordings] = useState([]);

    // Récupère les enregistrement sauvegardé précédement dans le dossier de l'app à l'arrivé sur la vue
    useEffect(() => {
        const fetchRecordings = async () => {
            const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
            const audioFiles = files.filter(file => !file.startsWith("v2") && file.endsWith('.m4a'));
            setRecordings(audioFiles);
        };
        fetchRecordings();
    }, []);

    // Supprime un enregistrement sauvegardé
    const deleteRecording = async (fileName) => {
        console.log(fileName);
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.deleteAsync(fileUri);
        setRecordings(recordings.filter(recording => recording !== fileName));
    };

    // Joue un enregistrement
    const playRecording = async (fileName) => {
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        const {sound} = await Audio.Sound.createAsync({uri: fileUri});
        await sound.playAsync();
    };

    // Permet la navigation vers la vue avec les model, en donnant comme paramètre l'enregistrement sur lequel on appuie
    const handlePress = (item) => {
        navigation.navigate('RAVE Screen', { fileName: item });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Selectionnez un audio</Text>
            <FlatList
                data={recordings}
                keyExtractor={(item) => item}
                renderItem={({item}) => (
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => handlePress(item)}
                    >
                        <Text style={styles.itemText}>{item}</Text>
                        <TouchableOpacity onPress={() => playRecording(item)}>
                            <Icon name="play-arrow" size={30} color="green" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteRecording(item)}>
                            <Icon name="delete" size={30} color="red" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    item: {
        flexDirection: 'row',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#ddd',
        borderRadius: 8,
    },
    itemText: {
        fontSize: 18,
    },
});

export default AudioListScreen;
