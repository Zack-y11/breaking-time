import { StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Group</ThemedText>
      <ThemedText type="subtitle" style={styles.id}>{id}</ThemedText>
      <ThemedText style={styles.placeholder}>— coming in Phase 4 —</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  id: {
    opacity: 0.5,
    fontSize: 14,
  },
  placeholder: {
    opacity: 0.4,
    fontSize: 13,
  },
});
