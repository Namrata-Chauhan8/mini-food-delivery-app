# Mini Food Delivery App

A React Native food delivery app built with **Expo SDK 57**, TypeScript and Expo Router.
No backend — all data is local/mock, and cart, favourites and orders persist on-device
through AsyncStorage.

---

## Setup & Run

**Prerequisites:** Node.js 20+ and the [Expo Go](https://expo.dev/go) app on your phone
(or an Android emulator / iOS simulator).

```bash
cd FoodDeliveryApp
npm install
npx expo start
```

Then scan the QR code with Expo Go (Android) or the Camera app (iOS).

| Command | What it does |
|---|---|
| `npx expo start` | Start the dev server |
| `npx expo start --clear` | Start with a cleared Metro cache |
| `npm run android` | Open on a connected Android device/emulator |
| `npm run ios` | Open on an iOS simulator |
| `npx tsc --noEmit` | Typecheck the project |

No native build step and no `.env` file is required — the project runs directly in Expo Go.

---

## Features

### Required

| Screen | What it does |
|---|---|
| **Home** | Search bar, category filter chips, paginated restaurant list, favourite toggle, pull-to-refresh |
| **Restaurant Details** | Restaurant info and stats, menu grouped into sections, in-menu search, add to cart, increase/decrease quantity, floating cart bar |
| **Cart** | Line items with quantity steppers, swipe-left to remove, live bill breakdown, proceed to checkout |
| **Checkout** | Validated address form, delivery instructions, payment method selection, order summary, Place Order |
| **Order Tracking** | Five-stage animated progress timeline (Order Placed → Accepted → Preparing → Out for Delivery → Delivered) |
| **Order History** | Past orders with ID, restaurant, total, date, status, and a tap-through to full details |
| **Login / Signup** | Front-end-only accounts: validated forms, duplicate-email and wrong-password handling, session kept across restarts |
| **Profile** | Signed-in details, order and favourite counts, sign out |

Plus: search across **both** restaurant names and dish names, add/remove favourites,
persistence of cart + favourites + orders, explicit loading / empty / error states,
reusable components, and a layout that adapts from phone to tablet.

### Bonus

- **Dark mode** — light / dark / follow-system, toggled from any tab header and persisted
- **Animations** — Reanimated 4: pulsing tracking timeline, skeleton shimmer, cart bar transitions
- **Optimised lists** — memoised rows, `windowSize` / `removeClippedSubviews` tuning, page-based pagination
- **Offline handling** — a banner via `expo-network`; the app keeps working because all data is local
- **Simulated auth** — guest browsing, login required only at checkout, guarded by `Stack.Protected`

---

## Tech Stack

| Package | Version | Why |
|---|---|---|
| `expo` | ~57.0.24 | SDK, tooling, Expo Go |
| `expo-router` | ~57.0.22 | File-based routing (built on React Navigation) |
| `zustand` | ^5.0.15 | State management — minimal boilerplate, selector-based re-renders |
| `@react-native-async-storage/async-storage` | 2.2.0 | Local persistence |
| `react-native-reanimated` + `react-native-worklets` | 4.5.1 / 0.10.1 | Animations (Reanimated 4 needs worklets as a separate package) |
| `react-native-gesture-handler` | ~2.32.0 | Swipe-to-remove in the cart |
| `expo-image` | ~57.0.5 | Disk-cached images with placeholders |
| `expo-network` | ~57.0.2 | Offline detection |
| `expo-haptics` | ~57.0.3 | Tactile feedback on cart actions |
| `expo-splash-screen` | ~57.0.9 | Held until persisted state is rehydrated |
| `@expo/vector-icons` | ^15.0.2 | Ionicons |
| `typescript` | ~6.0.3 | Strict mode enabled |

---

## Architecture

Routes stay thin — they compose components and wire data. Everything reusable lives in `src/`.

```
app/                           # Expo Router: file = route
  _layout.tsx                  # providers, hydration gate, offline banner
  (tabs)/
    _layout.tsx                # bottom tabs with live badges
    index.tsx                  # Home
    favorites.tsx
    orders.tsx                 # Order History
    profile.tsx                # Account details + sign out
  (auth)/
    login.tsx
    signup.tsx
  restaurant/[id].tsx          # Restaurant Details
  cart.tsx
  checkout.tsx
  order/[id].tsx               # Order Tracking + past-order detail
  +not-found.tsx

src/
  components/
    common/                    # Button, Card, Text, Badge, SearchBar, TextField,
                               # QuantityStepper, Skeleton, EmptyState, ErrorState…
    auth/  home/  restaurant/  cart/  checkout/  order/
  store/                       # Zustand slices, one per domain
  data/                        # Mock data + a fake async API layer
  hooks/                       # useRestaurants, useOrderStatus, useOffline, useDebouncedValue…
  theme/                       # Colour schemes, spacing, typography, ThemeProvider
  utils/                       # pricing, orderStatus, format, id, validation  (pure functions)
  types/                       # Shared domain types
```

### State management

**Zustand**, one store per domain, each wrapped in the `persist` middleware backed by
AsyncStorage through a single shared adapter (`src/store/storage.ts`):

| Store | Holds |
|---|---|
| `cartStore` | Items and which restaurant they came from |
| `favoritesStore` | Favourited restaurant ids |
| `ordersStore` | Placed orders, newest first |
| `themeStore` | `light` / `dark` / `system` preference |
| `authStore` | Local accounts and which one is signed in |

Zustand was chosen over Redux for the small, mostly-independent slices this app needs, and
over Context because selector subscriptions avoid re-rendering the whole tree when one
value changes.

Three decisions worth calling out:

**1. Derived values are never stored.** Subtotal, delivery fee, tax and total are computed
by pure functions in `src/utils/pricing.ts` and read through selectors. The cart persists
only its items, so the bill can never drift out of sync with what's in it — and the pricing
rules are testable in isolation.

**2. Order progress is derived from a timestamp, not mutated on a timer.** Each order stores
`placedAt`; `src/utils/orderStatus.ts` maps elapsed time onto the five stages. Progress
therefore stays correct across backgrounding and app restarts, and the store is written to
exactly once, when the order reaches *Delivered*.

**3. Hydration is gated.** The splash screen is held until every persisted store reports
`hydrated`, so the UI never flashes an empty cart while AsyncStorage is still resolving.
`authStore` is part of that gate, which is what lets a returning user skip the login screen
without it flashing on launch.

### Authentication (front-end only)

There is no server, so there is no real authentication. `authStore` keeps a list of accounts
in AsyncStorage and signing in just matches a stored record — **passwords are held in plain
text, and both auth screens say so.** It exists to give the ordering flow an identity, not to
protect anything.

The flow is built around guest browsing:

- Home, restaurants, cart and favourites are open to everyone.
- The cart's *Proceed to Checkout* button sends a signed-out user to `/login?redirect=checkout`
  instead, and drops them back at checkout once they are in.
- `/checkout` sits inside `<Stack.Protected guard={isSignedIn}>`, which is the backstop for
  deep links rather than the primary gate.
- Signing up also signs you in — there is no "now go and log in" detour.
- Sign-out clears cart, favourites and orders, because those stores are device-wide rather
  than namespaced per account.

Navigation out of the auth screens runs in an effect (`src/hooks/useAuthRedirect.ts`) rather
than in the submit handler: `/checkout` only becomes a registered route on the render *after*
the store update opens the guard, and the effect fires once that render has committed.

### Mock data & async states

`src/data/api.ts` wraps the local mock data in a fake network layer with artificial latency
(600 ms), page-based pagination, and a small random failure rate. That exists so the UI has
genuine **loading → error → empty → data** branches to render rather than reading arrays
synchronously.

To force a particular state for a demo, edit the constants at the top of that file:

```ts
export const SIMULATED_ERROR_RATE = 0.08;  // 1 = always fail, 0 = never fail
export const SIMULATED_LATENCY_MS = 600;
export const PAGE_SIZE = 6;
```

### Pricing rules

```
subtotal    = Σ (item price × quantity)
deliveryFee = subtotal ≥ ₹499 ? 0 : ₹40
tax         = round(subtotal × 5%)          // GST
total       = subtotal + deliveryFee + tax
```

### Theming & responsiveness

`ThemeProvider` composes the colour scheme (light/dark), spacing scale, type scale and
layout metrics into one object consumed via `useTheme()`. Layout metrics are derived from
`useWindowDimensions`, so the restaurant grid switches to two columns at tablet widths and
gutters scale with the screen.

---

## Screenshots / Demo

<!-- Add screenshots or a short screen recording here before submitting. -->

| Home | Restaurant | Cart |
|---|---|---|
| _screenshot_ | _screenshot_ | _screenshot_ |

| Checkout | Tracking | History |
|---|---|---|
| _screenshot_ | _screenshot_ | _screenshot_ |

---

## Notes

- Images are remote (Unsplash) and cached to disk by `expo-image`; first load needs a network
  connection, after which they are served from cache.
- Tested against Expo SDK 57 / React Native 0.86 / React 19.2 with the New Architecture enabled.
