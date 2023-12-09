/* src/DeviceList.jsx */

import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {styles} from './styles/styles';

 export const DeviceList = ({peripheral, connect, disconnect, read, readWeightData, writeWeightData, subscribeToNotifications, setLowVolume}) => {
  const {name, rssi, connected} = peripheral;
  return (
    <>
      {name && (
        <View style={styles.deviceContainer}>
          <View style={styles.deviceItem}>
            <Text style={styles.deviceName}>{name}</Text>
            <Text style={styles.deviceInfo}>RSSI: {rssi}</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              connected ? disconnect(peripheral) : connect(peripheral)
            }
            style={styles.deviceButton}>
            <Text
              style={[
                styles.scanButtonText,
                {fontWeight: 'bold', fontSize: 16},
              ]}>
              {connected ? 'Disconnect' : 'Connect'}
            </Text>
          </TouchableOpacity>
          {connected && (<TouchableOpacity
            onPress={() =>
              read(peripheral)
            }
            style={styles.deviceButton}>
            <Text
              style={[
                styles.scanButtonText,
                {fontWeight: 'bold', fontSize: 16},
              ]}>
              {'Read'}
            </Text>
          </TouchableOpacity>)}
          {connected && (<TouchableOpacity
            onPress={() =>
              readWeightData(peripheral)
            }
            style={styles.deviceButton}>
            <Text
              style={[
                styles.scanButtonText,
                {fontWeight: 'bold', fontSize: 16},
              ]}>
              {'Weight'}
            </Text>
          </TouchableOpacity>)}
          {connected && (<TouchableOpacity
            onPress={() =>
              writeWeightData(peripheral)
            }
            style={styles.deviceButton}>
            <Text
              style={[
                styles.scanButtonText,
                {fontWeight: 'bold', fontSize: 16},
              ]}>
              {'Write Weight'}
            </Text>
          </TouchableOpacity>)}
          {connected && (<TouchableOpacity
            onPress={() =>
              subscribeToNotifications(peripheral)
            }
            style={styles.deviceButton}>
            <Text
              style={[
                styles.scanButtonText,
                {fontWeight: 'bold', fontSize: 16},
              ]}>
              {'Subscribe Notification'}
            </Text>
          </TouchableOpacity>)}
          {connected && (<TouchableOpacity
            onPress={() =>
              setLowVolume(peripheral)
            }
            style={styles.deviceButton}>
            <Text
              style={[
                styles.scanButtonText,
                {fontWeight: 'bold', fontSize: 16},
              ]}>
              {'set low volume'}
            </Text>
          </TouchableOpacity>)}
          
        </View>
      )}
    </>
  );
};