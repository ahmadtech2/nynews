import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the Icon component

const DetailsScreen = ({ route }) => {
  const { article } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{article.title}</Text>
      <Image
        testID="article-image"
        source={{ uri: article.media[0]?.['media-metadata'][0]?.url || '' }}
        style={styles.image}
      />
      <Text style={styles.article}>{article.abstract}</Text>
      <View style={styles.authorContainer}>
        <Text style={styles.author}>{article.byline}</Text>
        <View style={styles.dateContainer}>
          <Icon
            name="calendar-outline" // Use the appropriate icon name
            size={18}
            color="gray"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.date}>{article.published_date}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 12,
  },
  article: {
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  author: {
    fontStyle: 'italic',
    flex: 1,
    color: 'gray'
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    color: 'gray'
  },
});

export default DetailsScreen;
