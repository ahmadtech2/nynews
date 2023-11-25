// App.js

import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import BleManager from 'react-native-ble-manager';

import {
  scanForDevices,
  connectToDevice,
  disconnectDevice,
  readCharacteristic,
} from './BluetoothManager';

export default function App() {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const scan_ForDevices = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        {
          title: 'Bluetooth Scan Permission',
          message: 'This app needs Bluetooth Scan permission for device discovery.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Permission granted, proceed with scanning
        const deviceCallback = (device) => {
          setDevices((prevDevices) => [...prevDevices, device]);
        };
        scanForDevices(deviceCallback);
      } else {
        console.warn('Bluetooth Scan permission denied. Cannot scan for devices.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const deviceCallback = (device) => {
      setDevices((prevDevices) => [...prevDevices, device]);
    };

    scan_ForDevices(deviceCallback);

    // Clean up when the component unmounts
    return () => {
      BleManager.stopScan();
    };
  }, []);

  const connect = async (deviceId) => {
    connectToDevice(deviceId);
    setConnectedDevice(deviceId);
  };

  const disconnect = async () => {
    if (connectedDevice) {
      disconnectDevice(connectedDevice);
      setConnectedDevice(null);
    }
  };

  const readDeviceInfo = async () => {
    if (connectedDevice) {
      //0x2A25
      const SERVICE_UUID = '00001800-0000-1000-8000-00805f9b34fb';
      const DEVICE_INFORMATION_UUID = '00002A25-0000-1000-8000-00805f9b34fb';
      readCharacteristic(connectedDevice, SERVICE_UUID, DEVICE_INFORMATION_UUID);
    }
  };

  const readVolumeInfo = async () => {
    // Similar to readDeviceInfo, but for the Volume Information characteristic
  };

  // Define other read functions for your characteristics as well

  return (
    <View>
      <Button title="Disconnect" onPress={disconnect} disabled={!connectedDevice} />
      <Button title="Scan for Devices" onPress={scan_ForDevices} />
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button title={item.name || 'Unknown'} onPress={() => connect(item.id)} />
        )}
      />

      <Button title="Read Device Information" onPress={readDeviceInfo} disabled={!connectedDevice} />
      {/* <Button title="Read Volume Information" onPress={readVolumeInfo} disabled={!connectedDevice} /> */}
      {/* Add buttons for other characteristics here */}
    </View>
  );
}
