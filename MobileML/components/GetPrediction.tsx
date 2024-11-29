import * as FileSystem from 'expo-file-system';
import axios from 'axios';


async function getPrediction(imageURI: string) {
    let base64Image = await FileSystem.readAsStringAsync(imageURI, {
        encoding: FileSystem.EncodingType.Base64,
      });
    console.log("Image converted to base64");
    // Step 2: Send the base64 image to the backend
    console.log("Image sent to server")
    const response = await fetch('http://10.0.0.163:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "image": base64Image }),
      });
    console.log("Response from server received");
    if (response.ok) {
        const data = await response.json();
        console.log('Prediction:', data.prediction);
        return data.prediction;
    } 
    else {
        console.error('Error with prediction request:', response.status);
    }
}

export default getPrediction;