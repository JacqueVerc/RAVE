import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import {Audio} from "expo-av";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAppState } from '../AppState';

// Page affichant les models, où on en choisi un et envoie l'audio choisi plus tôt pour qu'il soit modifié en fonction du model puis enregistré
const AudioDetailScreen = ({route}) => {
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uriDownloaded, setUriDownloaded] = useState("");
    const { ip, setIp, port, setPort } = useAppState();

    // Requête permettant la récupération des models sur le serveur à l"arrivée sur la vue (avec ip et port donnés saisies sur la page d'acceuil)
    useEffect(() => {
        const fetchModels = async () => {
            console.log(ip, port);
            try {
                const response = await axios.get(`http://${ip}:${port}/getmodels`);
                setModels(response.data.models);
            } catch (error) {
                console.error('Error fetching models', error);
            }
        };

        fetchModels();
    }, []);

    //Change le model du serveur et le sauvegarde dans un state
    const handleModelSelect = async (model) => {
        try {
            const response = await axios.get(`http://${ip}:${port}/selectModel/${model}`);
        } catch (error) {
            console.error('Error selecting models', error);
        }
        setSelectedModel(model);
    };

    // Joue un enregistrement
    const playRecording = async () => {
        const fileUri = `${FileSystem.documentDirectory}${route.params.fileName}`;
        const {sound} = await Audio.Sound.createAsync({uri: fileUri});
        await sound.playAsync();
    };

    // Envoie au serveur l'enregistrement choisie dans la vue précédente et télécharge le rendu en fonction du model choisi
    const handleUpload = async () => {
        // Récupère le chemin de l'audio choisi (transmis en paramètre dans la vue précédente)
        let fileName = route.params.fileName;
        const uri = `${FileSystem.documentDirectory}${route.params.fileName}`;
        if (!fileName) {
            Alert.alert('No audio selected', 'Please select an audio file first.');
            return;
        }
        // Lance le loader
        setUploading(true);
        // Upload notre audio sur le serveur
        try {
            const resp = await FileSystem.uploadAsync(`http://${ip}:${port}/upload`, uri, {
                fieldName: 'file',
                httpMethod: 'POST',
                uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                headers: {filename: uri}
            })
            console.log(resp.body);
        } catch (error) {
            console.error('Error uploading audio', error);
            Alert.alert('Error', 'Failed to upload audio.');
        }

        // Download le rendu depuis le serveur et le sauvegarde dans le dossier de l'app
        try {
            const downloadRes = await FileSystem.downloadAsync(`http://${ip}:${port}/download`, `${FileSystem.documentDirectory}v2${route.params.fileName}`);
            console.log('Download response:', downloadRes);

            if (downloadRes.status === 200) {
                setUriDownloaded(`${FileSystem.documentDirectory}v2${route.params.fileName}`)
            } else {
                Alert.alert('Error', 'Failed to download audio.');
            }
        } catch (error) {
            console.error('Error downloading audio', error);
        } finally {
            // Stop le loader
            setUploading(false);
        }
    };

    // Joue l'audio télécahargé
    const playDownloadedAudio = async (uri) => {
        const {sound} = await Audio.Sound.createAsync({uri});
        await sound.playAsync();
        console.log(uriDownloaded);
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Choisissez un model</Text>
            {uploading &&
                <ActivityIndicator size="large"/>
            }
            <FlatList
                data={models}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                    <TouchableOpacity
                        style={[
                            styles.item,
                            selectedModel === item && styles.selectedItem
                        ]}
                        onPress={() => handleModelSelect(item)}
                    >
                        <Text style={styles.itemText}>{item}</Text>
                    </TouchableOpacity>
                )}
            />
            {selectedModel && (
                <View style={styles.selectedModelContainer}>
                    <Text style={styles.selectedModelText}>Model selectionné : {selectedModel}</Text>
                </View>
            )}
            <View>
                <Text>{route.params.fileName}</Text>
                <TouchableOpacity onPress={() => playRecording()}>
                    <Icon name="play-arrow" size={30} color="green"/>
                </TouchableOpacity>
                {uriDownloaded &&
                    <>
                        <Text>{uriDownloaded.split('/').pop()}</Text>
                        <TouchableOpacity onPress={() => playDownloadedAudio(uriDownloaded)}>
                            <Icon name="play-arrow" size={30} color="green"/>
                        </TouchableOpacity>
                    </>
                }
            </View>
            <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleUpload}
                disabled={uploading}
            >
                <Text style={styles.uploadButtonText}>{uploading ? 'Envoie...' : 'Envoyer votre audio'}</Text>
            </TouchableOpacity>
        </View>
    );
};

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
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#ddd',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectedItem: {
        backgroundColor: '#aaf',
    },
    itemText: {
        fontSize: 18,
    },
    selectedModelContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#aaf',
        borderRadius: 8,
    },
    selectedModelText: {
        fontSize: 18,
    },
    uploadButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#007BFF',
        borderRadius: 8,
    },
    uploadButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default AudioDetailScreen;
