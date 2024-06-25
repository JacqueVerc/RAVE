import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialIcons';



const DownloadedAudioListScreen = ({navigation}) => {
    const [recordings, setRecordings] = useState([]);

    useEffect(() => {
        const fetchRecordings = async () => {
            const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
            const audioFiles = files.filter(file => file.startsWith("v2") && file.endsWith('.m4a'));
            setRecordings(audioFiles);
        };
        fetchRecordings();
    }, []);

    const deleteRecording = async (fileName) => {
        console.log(fileName);
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.deleteAsync(fileUri);
        setRecordings(recordings.filter(recording => recording !== fileName));
    };

    const playRecording = async (fileName) => {
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        const {sound} = await Audio.Sound.createAsync({uri: fileUri});
        await sound.playAsync();
    };

    const handlePress = (item) => {
        navigation.navigate('ModelScreen', { fileName: item });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vos audios modifiés</Text>
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

export default DownloadedAudioListScreen;
