// BluetoothManager.js

import BleManager from 'react-native-ble-manager';

BleManager.start();

export async function scanForDevices(callback) {
  BleManager.scan([], 5, true)
    .then(() => {
      BleManager.getDiscoveredPeripherals([]).then((peripheralsArray) => {
        peripheralsArray.forEach((device) => {
          callback(device);
        });
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function connectToDevice(deviceId) {
  BleManager.connect(deviceId)
    .then(() => {
      console.log(`Connected to ${deviceId}`);
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function disconnectDevice(deviceId) {
  BleManager.disconnect(deviceId)
    .then(() => {
      console.log(`Disconnected from ${deviceId}`);
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function readCharacteristic(deviceId, serviceUUID, characteristicUUID) {
  BleManager.read(deviceId, serviceUUID, characteristicUUID)
    .then((data) => {
      console.log(`Read from ${characteristicUUID}:`, data);
    })
    .catch((error) => {
      console.error(`Error reading from ${characteristicUUID}:`, error);
    });
}
