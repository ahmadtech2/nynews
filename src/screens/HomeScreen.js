import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchMostEmailedArticles } from '../services/api'; // Update the path
import Icon from 'react-native-vector-icons/Ionicons'; // Import the Icon component

const HomeScreen = ({ navigation }) => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMostEmailedArticles();
        setArticles(data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('Details', { article: item })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.media[0]?.['media-metadata'][0]?.url || '' }}
          style={styles.image}
        />
      </View>
      <View style={styles.textContainer}>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
          {item.title}
        </Text>
        <View style={styles.infoContainer}>
          <View style={styles.authorContainer}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.author}>
              {item.byline}
            </Text>
          </View>
          <View style={styles.dateContainer}>
            <Icon
              name="calendar-outline" // Use the appropriate icon name
              size={18}
              color="gray"
              style={styles.dateIcon}
            />
            <Text style={styles.date}>{item.published_date}</Text>
          </View>
        </View>
      </View>
      <View style={styles.iconContainer}>
        <Icon
          name="chevron-forward" // Use the appropriate icon name for arrow
          size={18}
          color="gray"
        />
      </View>
    </TouchableOpacity>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <FlatList
      testID={'flat-list'}
      data={articles}
      renderItem={renderItem}
      ItemSeparatorComponent={renderSeparator}
      keyExtractor={(item) => item.uri}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flex: 4,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  author: {
    overflow: 'hidden',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  arrowIcon: {
    fontSize: 18,
  },
  separator: {
    height: 1,
    backgroundColor: 'gray',
  },
  infoContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorContainer: {
    flex: 1,
    paddingRight: '10%', // Minimum space between author and date
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 5,
  },
});
export default HomeScreen;
