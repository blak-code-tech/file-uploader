import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraWithFlash from './screens/CameraWithFlash';
import UploadWithProgress from './screens/UploadWithProgress';
import { StatusBar } from 'expo-status-bar';

function HomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap:20 }}>
      <Button
        title="Camera With Flash"
        onPress={() => navigation.navigate('Flash')}
      />
      <Button
        title="Upload With Progress"
        onPress={() => navigation.navigate('Upload')}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Flash" component={CameraWithFlash} />
        <Stack.Screen name="Upload" component={UploadWithProgress} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;