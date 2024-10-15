import React, { useState } from 'react';
import { Button, Image, Text, View, PermissionsAndroid, StyleSheet } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
// import OutlineButton from '../../ui/outlineButton';
import { Colors } from '../../constants/colors';
import OutlinedButton from '../UI/OutlinedButton';


const ImagePicker = ({ onTakeImage }) => {
  const [pickedImage, setPickedImage] = useState(null);

  async function takeImageHandler() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        const options = {
          mediaType: 'photo',
          quality: 0.8,
          includeBase64: false,
        };
        const image = await launchCamera(options);
        const pickedImageUri = image.assets ? image.assets[0].uri : null; // Handle possible 'undefined'
        setPickedImage(pickedImageUri);
        if (onTakeImage) {
          onTakeImage(pickedImageUri);
        }
        console.log('image result', image);
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  let imagePreview = <Text>No Image Taken yet</Text>;

  if (pickedImage) {
    imagePreview = <Image style={styles.image} source={{ uri: pickedImage }} />;
  }

  return (
    <View>
      <View style={styles.imageContainer}>{imagePreview}</View>
      <OutlinedButton icon='camera' onPress={takeImageHandler}>
        Take Image
      </OutlinedButton>
    </View>
  );
};

export default ImagePicker;


export const styles = StyleSheet.create({
    imageContainer : {
        width : '100%',
        height : 200,
        marginVertical : 8,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : Colors.primary100,
        borderRadius : 4
    },
    image : {
        width : '100%',
        height : '100%'
    }
    
})