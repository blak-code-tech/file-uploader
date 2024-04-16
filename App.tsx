import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ImageViewer from './components/ImageViewer';
import * as FileSystem from 'expo-file-system';
import * as Progress from 'react-native-progress';

export default function App() {
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);

    } else {
      alert('You did not select any image.');
    }
  };

  const reset = () => {
    setShowAppOptions(false);
    setSelectedImage(null);
  }

  const uploadImage = async () => {
    setShowProgress(true);
    try {
      const uploadTask = FileSystem.createUploadTask("https://upload-pipe1.tagg.id/v1/action/upload", selectedImage, {
        fieldName: 'file',
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      }, ({ totalBytesSent, totalBytesExpectedToSend }) => {
        const progress = parseFloat((totalBytesSent / (totalBytesExpectedToSend || 1)).toFixed(2));
        setUploadProgress(progress);
      });

      const result = await uploadTask.uploadAsync();
 
      if (result?.status === 200) {
        setSelectedImage(null);
        setShowAppOptions(false);
        alert('Upload success')
      }
      else {
        alert('Upload failed')
      }
    } catch (error) {
      alert('Upload failed: you fucked up: ' + error);
    }

    setShowProgress(false);
  }

  return (
    <View style={styles.container}>
      {showProgress && <Progress.Bar progress={uploadProgress} width={200} />}
      <ImageViewer
        selectedImage={selectedImage}
      />

      <View style={{flexDirection:'row', justifyContent: showAppOptions ? 'space-between' : 'center', width:'90%'}}>
        {showAppOptions &&
          <Pressable onPress={reset}>
            <Text style={{ color: 'black', fontSize: 20 }}>Reset</Text>
          </Pressable>}
        {!showAppOptions &&
          <Pressable onPress={async () => await pickImageAsync()}>
            <Text style={{ color: 'black', fontSize: 20 }}>Open Gallery</Text>
          </Pressable>}
        {showAppOptions &&
          <Pressable onPress={async () => await uploadImage()}>
            <Text style={{ color: 'black', fontSize: 20 }}>Upload</Text>
          </Pressable>}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30
  },
});
