import os
import base64
from io import BytesIO
from PIL import Image
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

model = tf.keras.models.load_model("model/test-model.h5")

# Function to decode the base64 image
def decode_base64_image(base64_string):
    img_data = base64.b64decode(base64_string)
    img = Image.open(BytesIO(img_data))
    img = img.convert('L')
    return img


# Route to handle image prediction
@app.route('/predict', methods=['POST'])
def predict():
    print("Hit on /predict")
    try:
        # Step 1: Get the base64 image from the request
        data = request.get_json()  # Expecting JSON body
        base64_image = data['image']

        # Step 2: Decode the base64 image
        img = decode_base64_image(base64_image)

        # Step 3: Preprocess the image for your model (adjust as needed)
        img = img.resize((28, 28))  # Resize image (for example, if using ResNet)
        img_array = np.array(img)  # Convert image to numpy array
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
        print(img_array.shape)
        # Step 4: Make a prediction with the model
        prediction = model.predict(img_array)

        # Step 5: Process the model's output and prepare the response
        # Assuming the model outputs class probabilities (for a classification task)
        predicted_class = np.argmax(prediction, axis=-1)  # Get the class with the highest probability
        print(predicted_class)
        # You can return more details like class probabilities, if needed
        response = {
            'prediction': str(predicted_class[0])  # or use actual class name/label if you have a mapping
        }

        return jsonify(response)  # Send back the prediction as JSON
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/')
def main():
    print("Hit on /")
    return "Hello, World!"



if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8000, debug=True)
