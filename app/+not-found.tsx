import { Stack, useRouter } from 'expo-router';
import { EmptyState, Screen } from '../src/components/common';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <Screen edges={[]}>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <EmptyState
        icon="help-circle-outline"
        title="This page doesn't exist"
        message="The screen you tried to open could not be found."
        actionLabel="Go home"
        onAction={() => router.replace('/')}
      />
    </Screen>
  );
}
