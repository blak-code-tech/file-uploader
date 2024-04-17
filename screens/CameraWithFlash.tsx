import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import { CameraType, CameraView, FlashMode, useCameraPermissions } from 'expo-camera/next';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
    const cameraRef = useRef<CameraView>(null);
    const [isPicture, setIsPicture] = useState<boolean>(false)
    const [isRecording, setIsRecording] = useState<boolean>(false)
    const [enableTorch, setEnableTorch] = useState<boolean>(false)
    const [facing, setFacing] = useState<CameraType>('back');
    const [flash, setFlash] = useState<FlashMode>('off');
    const [permission, requestPermission] = useCameraPermissions();

    useEffect(() => {
        (async () => {
            const { status } = await requestPermission();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        })();
    }, [])
    function toggleCameraFacing() {
        const torchWasOn = enableTorch;
        setEnableTorch(false)
        setFacing(current => (current === 'back' ? 'front' : 'back'));
        if (torchWasOn) {
            setTimeout(() => { setEnableTorch(true) }, 500)
        }
    }

    const recordVideo = async () => {
        (await requestPermission()).canAskAgain && await requestPermission();
        setIsRecording(prev => !prev)

        const res = await cameraRef.current?.recordAsync({
            mirror: true,
            maxDuration: 30
        })

        console.log(res?.uri);
    }

    const stopRecording = () => {
        setIsRecording(prev => !prev)
        cameraRef.current?.stopRecording();
    }

    const takePicture = async () => {
        const res = await cameraRef.current?.takePictureAsync();
        console.log(res?.uri);
    }

    const toggleCameraType = () => {
        setIsPicture(prev => !prev)
    }

    if (permission === null) {
        return <View />;
    }

    function toggleCameraFlash(type: FlashMode | "torch") {

        if (type === "torch") {
            setFlash("off")
            setEnableTorch(true)
        }
        else {
            setEnableTorch(false)
            setFlash(() => type)
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 20 }}>
                <TouchableOpacity onPress={() => toggleCameraFlash("off")}>
                    <MaterialIcons name="flash-off" size={24} color={flash === "off" && !enableTorch ? "black":"gray"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleCameraFlash("auto")}>
                    <MaterialIcons name="flash-auto" size={24} color={flash === "auto" ? "black" : "gray"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleCameraFlash("on")}>
                    <MaterialIcons name="flash-on" size={24} color={flash === "on" ? "black" : "gray"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleCameraFlash("torch")}>
                    <Entypo name="flashlight" size={24} color={flash === "off" && enableTorch ? "black" : "gray"} />
                </TouchableOpacity>
            </View>
            <CameraView ref={cameraRef} style={styles.camera} enableTorch={enableTorch} flash={flash} facing={facing} />
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 20 }}>
                <View style={{ gap: 60, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={toggleCameraType}>
                        {isPicture ?
                            <AntDesign name="picture" size={24} color="gray" />
                            :
                            <AntDesign name="videocamera" size={24} color="gray" />}
                    </TouchableOpacity>
                    {!isRecording &&
                        <TouchableOpacity onPress={async () => isPicture ? await takePicture() : await recordVideo()}>
                            <View style={{ height: 50, width: 50, backgroundColor: 'black', borderRadius: 25 }} />
                        </TouchableOpacity>}
                    {isRecording &&
                        <TouchableOpacity onPress={stopRecording}>
                            <View style={{ height: 50, width: 50, backgroundColor: 'red', borderRadius: 25 }} />
                        </TouchableOpacity>}
                    <TouchableOpacity onPress={toggleCameraFacing}>
                        <MaterialIcons name="cameraswitch" size={24} color="gray" />
                    </TouchableOpacity>
                </View>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    camera: {
        flex: 1,
    },
    actionsContainer: {
        flex: 1,
        margin: 20,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'gray',
    },
});