import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { selectIsSignedIn, useAuthStore } from '../store/authStore';

/**
 * Where to send the user after they sign in. Only the routes listed here are
 * reachable through the `redirect` param, so a stray deep link cannot aim the
 * post-login navigation at an arbitrary screen.
 */
export type AuthRedirect = 'checkout' | undefined;

export function toAuthRedirect(value: string | undefined): AuthRedirect {
  return value === 'checkout' ? 'checkout' : undefined;
}

/**
 * Drives navigation out of the login / signup screens.
 *
 * The navigation runs in an effect rather than in the submit handler because
 * /checkout sits behind a <Stack.Protected> guard: the guard only opens on the
 * render that follows the store update, and this effect fires after that render
 * has committed.
 */
export function useAuthRedirect(redirect: AuthRedirect): void {
  const router = useRouter();
  const isSignedIn = useAuthStore(selectIsSignedIn);

  // Captured once: someone already signed in when the form mounted got here by
  // deep link, so send them home instead of showing them a sign-in screen.
  const wasSignedInOnMount = useRef(isSignedIn);

  useEffect(() => {
    if (!isSignedIn) return;

    const justSignedIn = !wasSignedInOnMount.current;
    // replace() so the back gesture never returns to the form we just left.
    router.replace(justSignedIn && redirect === 'checkout' ? '/checkout' : '/(tabs)');
  }, [isSignedIn, redirect, router]);
}
