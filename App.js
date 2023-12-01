/* App.js */

import React, {useState, useEffect} from 'react';
import {
  Text,
  Alert,
  View,
  FlatList,
  Platform,
  StatusBar,
  SafeAreaView,
  NativeModules,
  useColorScheme,
  TouchableOpacity,
  NativeEventEmitter,
  PermissionsAndroid,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {DeviceList} from './src/DeviceList';
import {styles} from './src/styles/styles';
import { Buffer } from "@craftzdog/react-native-buffer";

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const App = () => {
  const peripherals = new Map();
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const handleGetConnectedDevices = () => {
    console.log('handleGetConnectedDevices');
    BleManager.getBondedPeripherals([]).then(results => {
      for (let i = 0; i < results.length; i++) {
        let peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
      }
    });
  };
  useEffect(() => {
    BleManager.enableBluetooth().then(() => {
      console.log('Bluetooth is turned on!');
    });
    BleManager.start({showAlert: false}).then(() => {
      console.log('BleManager initialized 1');
      // startScan()
      handleGetConnectedDevices();
    });
    let stopDiscoverListener = BleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      peripheral => {
        peripherals.set(peripheral.id, peripheral);
        setDiscoveredDevices(Array.from(peripherals.values()));
      },
    );
    let stopConnectListener = BleManagerEmitter.addListener(
      'BleManagerConnectPeripheral',
      peripheral => {
        console.log('BleManagerConnectPeripheral:', peripheral);
      },
    );
    let stopScanListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        setIsScanning(false);
        console.log('scan stopped');
      },
    );
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(result => {
            if (result) {
              console.log('User accepted');
            } else {
              console.log('User refused');
            }
          });
        }
      });
    }
    return () => {
      stopDiscoverListener.remove();
      stopConnectListener.remove();
      stopScanListener.remove();
    };
  }, []);
  const startScan = () => {
    console.warn('clicked');
    if (!isScanning) {
      BleManager.scan([], 5, true)
        .then(() => {
          console.warn('scan');
          console.log('Scanning...');
          setIsScanning(true);
        })
        .catch(error => {
          console.warn('error');
          console.error(error);
        });
    } else {
      console.warn('already scanning')
    }
  };
  const retrieveServicesAndReadWrite = async (deviceId) => {
    try {
      // Connect to the device
      await BleManager.connect(deviceId);
      console.log('Connected to device');
  
      // Retrieve services and characteristics
      const serviceInfo = await BleManager.retrieveServices(deviceId);
      console.log('Retrieved services:', serviceInfo);
  
      // Access service and characteristic UUIDs from retrieved information
      const serviceUUID = Object.keys(serviceInfo)[0]; // Replace with the specific service index
      const characteristicUUID = Object.keys(serviceInfo[serviceUUID].characteristics)[0]; // Replace with the specific characteristic index
  
      // Perform a read operation on a characteristic
      const readData = await BleManager.read(deviceId, serviceUUID, characteristicUUID);
      console.log('Read data:', readData);
  
      // Prepare data for writing (assuming it's a string)
      const dataToWrite = 'Hello from React Native';
  
      // Perform a write operation on a characteristic
      await BleManager.write(deviceId, serviceUUID, characteristicUUID, Buffer.from(dataToWrite, 'utf8').toString('base64'));
      console.log('Data written successfully');
    } catch (error) {
      console.log('Error:', error);
    }
  };
  // pair with device first before connecting to it
  const connectToPeripheral = peripheral => {
    // BleManager.createBond(peripheral.id)
    //   .then(() => {
    //     peripheral.connected = true;
    //     peripherals.set(peripheral.id, peripheral);
    //     setConnectedDevices(Array.from(peripherals.values()));
    //     setDiscoveredDevices(Array.from(peripherals.values()));
    //     console.log('BLE device paired successfully');
    //   })
    //   .catch(() => {
    //     console.log('failed to bond');
    //   });
    BleManager.connect(peripheral.id).then(result => {
      console.log('connect result', result);
      peripheral.connected = true;
      peripherals.set(peripheral.id, peripheral);
      setConnectedDevices(Array.from(peripherals.values()));
      setDiscoveredDevices(Array.from(peripherals.values()));
      console.log('BLE device paired successfully');
      // Retrieve services and characteristics
      BleManager.retrieveServices(peripheral.id)
      .then(info => {
       
        info.characteristics.forEach(element => {
          console.log(element);
        });
        // Process the retrieved services and characteristics
      })
      .catch(error => {
        console.log('Service retrieval error:', error);
      });
    })
         .catch(() => {
        console.log('failed to bond');
      });
  };
  const toggleRead = async (peripheral) => {
    // const serviceUUID = '00001800-0000-1000-8000-00805f9b34fb';
    // const characteristicUUID = '00002A25-0000-1000-8000-00805f9b34fb';

    const deviceId = peripheral.id; // Replace with the actual device ID
    const serviceUUID = 'fef0'; // Device Information Service UUID
    const characteristicUUID = {
      SERIAL: '2A25',
      VOLUME: '2A41',
      Unilateral_bilateral: 'FEF1',
      Maximum_resistance: 'FEF2',
      WiFi: 'FEF4',
      DEVICE_ACTIVATION: 'FEF5',
      PRIVATE_PROTOCOLE: '1234',
    }; // Serial Number String Characteristic UUID
  
    const commandId = 0x0D;
    const parameter = 0x01;

    const commandBuffer = new Uint8Array([commandId, parameter]);

  // BleManager.writeWithoutResponse(deviceId, serviceUUID, characteristicUUID, commandBuffer)
  //   .then(() => {
  //     console.log('Command sent for reading device serial number');
      // Now, wait for the device to send back the data to be read
      
      BleManager.read(deviceId, serviceUUID, characteristicUUID.PRIVATE_PROTOCOLE)
        .then(data => {
          const dataString = String.fromCharCode.apply(null, new Uint8Array(data));
          // console.log('Device Serial Number:', dataString);
          console.log(data);
          // Process the device serial number data
          const asciiText = data.map(byte => String.fromCharCode(byte)).join('');
          console.log('ASCII Text:', asciiText);
          const hexString = data.map(byte => byte.toString(16).padStart(2, '0')).join('');
          console.log('Hexadecimal:', hexString);
        })
        .catch(readError => {
          console.log('Read Device Serial Number error:', readError);
        });
    // })
    // .catch(writeError => {
    //   console.log('Write command error:', writeError);
    // });
    if (peripheral && peripheral.connected) {
      // try {
      //   await BleManager.read(peripheral.id);
      // } catch (error) {
      //   console.error(
      //     `[toggleRead][${peripheral.id}] error when trying to disconnect device.`,
      //     error,
      //   );
      // }
      // BleManager.read(peripheral.id, '180A', '2A25')
      // .then((data) => {
      //   console.log(`Read from ${characteristicUUID}:`, data);
      //   const dataString = String.fromCharCode.apply(null, new Uint8Array(data)); // Convert data to a readable string
      //   Alert.alert('info', dataString);
      // })
      // .catch((error) => {
      //   Alert.alert('Error', JSON.stringify(error));
      //   console.error(`Error reading from ${characteristicUUID}:`, error);
      // });
    } else {
      Alert.alert('info', 'not connected');
    }
  }
  const readWeightDataaa = async (peripheral) => {
    try {
      const serviceUUID = 'fef0';
      const characteristicUUID = '1234';
      const deviceId = peripheral.id;
      // Connect to the device
      await BleManager.connect(deviceId);
  
      // Read the weight data
      const data = await BleManager.read(deviceId, serviceUUID, characteristicUUID);
      console.log(data);
      const asciiText = data.map(byte => String.fromCharCode(byte)).join('');
      console.log('ASCII Text:', asciiText);
      const hexString = data.map(byte => byte.toString(16).padStart(2, '0')).join('');
      console.log('Hexadecimal:', hexString);
      // Interpret and process the received data
      // const leftSide = data.slice(2, 6); // 4 bytes for left side
      // const rightSide = data.slice(6, 10); // 4 bytes for right side
  
      // // Convert bytes to actual weight value
      // const weight = (leftSide.readInt32LE(0) * 0.1 + rightSide.readInt32LE(0) * 0.0001).toFixed(1);
      
      console.log('Weight:', weight, 'KG');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const readWeightData = async (peripheral) => {
    try {
      // Connect to the device
      const serviceUUID = 'fef0';
      const characteristicUUID = 'fef6';
      const deviceId = peripheral.id;
      await BleManager.connect(deviceId);
      console.log('Connected to device');
  
      // Synchronous header (0xAB 0xCD) and Command ID (0x01) for reading weight
      const commandBuffer = Buffer.from([0xAB, 0xCD, 0x04, 0x00]);

      // Write the command to trigger weight data reading
      await BleManager.writeWithoutResponse(deviceId, serviceUUID, characteristicUUID, [0xAB, 0xCD, 0x04]);
      console.log('Command written successfully for reading weight');

      // Read the weight data
      const data = await BleManager.read(deviceId, serviceUUID, characteristicUUID);
      console.log(data);
      const asciiText = data.map(byte => String.fromCharCode(byte)).join('');
      console.log('ASCII Text:', asciiText);
      const hexString = data.map(byte => byte.toString(16).padStart(2, '0')).join('');
      console.log('Hexadecimal:', hexString);
      // Interpret and process the received dat
      // // Interpret and process the received weight data
      // const leftSide = data.slice(2, 6); // 4 bytes for left side
      // const rightSide = data.slice(6, 10); // 4 bytes for right side

      // // Convert bytes to actual weight value
      // const weight = (leftSide.readInt32LE(0) * 0.1 + rightSide.readInt32LE(0) * 0.0001).toFixed(1);
      
      // console.log('Weight:', weight, 'KG');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  // disconnect from device
  const disconnectFromPeripheral = peripheral => {
    // BleManager.removeBond(peripheral.id)
    //   .then(() => {
    //     peripheral.connected = false;
    //     peripherals.set(peripheral.id, peripheral);
    //     setConnectedDevices(Array.from(peripherals.values()));
    //     setDiscoveredDevices(Array.from(peripherals.values()));
    //     Alert.alert(`Disconnected from ${peripheral.name}`);
    //   })
    //   .catch(() => {
    //     console.log('fail to remove the bond');
    //   });
    BleManager.disconnect(peripheral.id).then(result => {
        peripheral.connected = false;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
        setDiscoveredDevices(Array.from(peripherals.values()));
        Alert.alert(`Disconnected from ${peripheral.name}`);
    })
         .catch(() => {
        console.log('failed to dis');
      });
  };
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  // render list of bluetooth devices
  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{pdadingHorizontal: 20}}>
        <Text
          style={[
            styles.title,
            {color: isDarkMode ? Colors.white : Colors.black},
          ]}>
          React Native BLE Manager Tutorial
        </Text>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={startScan}>
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
          </Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.subtitle,
            {color: isDarkMode ? Colors.white : Colors.black},
          ]}>
          Discovered Devices:
        </Text>
        {discoveredDevices.length > 0 ? (
          <FlatList
            data={discoveredDevices}
            renderItem={({item}) => (
              <DeviceList
                peripheral={item}
                connect={connectToPeripheral}
                read={toggleRead}
                readWeightData={readWeightData}
                disconnect={disconnectFromPeripheral}
              />
            )}
            keyExtractor={item => item.id}
          />
        ) : (
          <Text style={styles.noDevicesText}>No Bluetooth devices found</Text>
        )}
        <Text
          style={[
            styles.subtitle,
            {color: isDarkMode ? Colors.white : Colors.black},
          ]}>
          Connected Devices:
        </Text>
        {connectedDevices.length > 0 ? (
          <FlatList
            data={connectedDevices}
            renderItem={({item}) => (
              <DeviceList
                peripheral={item}
                connect={connectToPeripheral}
                readWeightData={readWeightData}
                disconnect={disconnectFromPeripheral}
                read={toggleRead}
              />
            )}
            keyExtractor={item => item.id}
          />
        ) : (
          <Text style={styles.noDevicesText}>No connected devices</Text>
        )}
      </View>
    </SafeAreaView>
  );
};
export default App;