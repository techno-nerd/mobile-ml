import { Button, StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import { CameraView, Camera, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import deleteFile from './DeleteFile';
import getPrediction from './GetPrediction';
import axios from 'axios';


function HandleClick({ cameraRef }: { cameraRef: React.RefObject<CameraView> }) {
  const [prediction, setPrediction] = useState<string | null>(null);

  const handleClick = async () => {
    const photo = await cameraRef.current?.takePictureAsync();
    console.log(photo?.uri);

    if(photo?.uri) {
      const pred = await getPrediction(photo?.uri);
      setPrediction(pred);
    }

    deleteFile(photo?.uri);
  }

  const handleLongClick = async () => {
    console.log("Long press...");
    const test = await axios.get('http://10.0.0.163:8000/');
    console.log(test.status);
  }
    
    return (
      <>
      <TouchableWithoutFeedback onPress={handleClick} delayPressIn={0} onLongPress={handleLongClick}>
        <View style={styles.touchableArea} />
      </TouchableWithoutFeedback>
      <Text style={styles.Text}>Prediction: {prediction ? prediction : "Loading..."}</Text>
      </>
    );
  }

  const styles = StyleSheet.create({
    touchableArea: {
      ...StyleSheet.absoluteFillObject, // Makes the area cover the entire screen
    },

    Text: {
      marginBottom:30,
      fontSize: 64
    }
  });

export default HandleClick;