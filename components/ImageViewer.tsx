import { ImageBackground } from "expo-image";
import { Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons'

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

export default function ImageViewer({ selectedImage }: any) {
    const imageSource = selectedImage ? { uri: selectedImage } : null;

    return <ImageBackground source={imageSource} style={{
        height: height * 0.6, width: width * 0.9, alignItems:'center',justifyContent:'center',
        backgroundColor: 'rgba(11, 11, 11, 0.8)',borderRadius: 20,
    }}>
        
        {imageSource === null &&
            <Ionicons name="image-outline" size={(height * 0.6) * 0.2} color={'white'} />}
        
    </ImageBackground>;
}
