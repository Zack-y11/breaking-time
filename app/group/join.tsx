import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function JoinGroupScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Join Group</ThemedText>
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
  placeholder: {
    opacity: 0.4,
    fontSize: 13,
  },
});
