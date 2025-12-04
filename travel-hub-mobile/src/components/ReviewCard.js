import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const ReviewCard = ({ review }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{review.name}</Text>
          <Text style={styles.metadata}>
            {review.country} • {review.type} • {review.date}
          </Text>
        </View>
        {review.averageScore && (
          <View style={styles.scoreContainer}>
            <Ionicons name="star" size={16} color="#FFB800" />
            <Text style={styles.score}>{review.averageScore.toFixed(1)}</Text>
          </View>
        )}
      </View>

      {review.headline && (
        <Text style={styles.headline}>{review.headline}</Text>
      )}

      {review.pros && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="thumbs-up" size={16} color="#10b981" />
            <Text style={styles.sectionTitle}>Pros</Text>
          </View>
          <Text style={styles.sectionText}>{review.pros}</Text>
        </View>
      )}

      {review.cons && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="thumbs-down" size={16} color="#ef4444" />
            <Text style={styles.sectionTitle}>Cons</Text>
          </View>
          <Text style={styles.sectionText}>{review.cons}</Text>
        </View>
      )}

      {review.source && (
        <Text style={styles.source}>Source: {review.source}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  metadata: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  score: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 4,
  },
  headline: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 6,
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  source: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
});

