# 📝 Premium Universal Notes App UI (React Native & Expo)

Welcome to the **Premium Responsive & Theme-Aware Notes App UI**! This universal mobile application is built using **React Native (Expo)**. It is designed to look stunningly elegant across iOS, Android, and Web viewports. It implements a highly sophisticated design system with real-time responsive grid resizing, slate-optimized light/dark appearance syncing, and dynamic category-themed note tags.

---

## 🌟 Key Features

### 1. View 1 — Notes Listing Screen
* **Adaptive Masonry-Like Grid Layout**: Automatically calculates viewport space using `useWindowDimensions()` to shift columns:
  * **Phones**: Clean, single-column stream of note cards.
  * **Tablets**: 2-column grid.
  * **Widescreen Web/Desktop**: 3-column layout.
* **Instant Search & Filtering**: A modern search input with interactive reset capability filters note titles and body content in real-time.
* **Dynamic Multi-Color Categories**: Notes display visual left-border indicators, category badges, and soft tinted backgrounds matching one of six categories:
  * **Work** (Indigo) | **Ideas** (Emerald) | **Personal** (Amber) | **Creative** (Rose) | **Finance** (Cyan) | **Important** (Purple)
* **Custom Empty States**: Renders an elegant illustration and customized guide lines if search results return empty.
* **Theme Switching Toggle**: Flipped manually, it overrides the system theme and instantly refreshes card borders, text, and inputs.

### 2. View 2 — Note Editor Screen
* **Interactive Category Picker**: Allows users to dynamically assign categories. Changing categories updates badge text and input border highlights in real-time to match!
* **Keyboard-Safe Long-Form Writing**: Combines `KeyboardAvoidingView` with a nested `ScrollView` so inputs stay fully visible and comfortable to type in when virtual mobile keyboards pop up.
* **Sunset Gradient Header Backdrop**: Features a sleek, modern custom gradient background overlaid with glassmorphic Back and Save `Pressable` buttons.

---

## 🛠️ Code Structure & File Map

* **[index.tsx](src/app/index.tsx)**: Main application controller. Holds note databases, coordinates state transitions between listing and editor screens, and binds manual theme selectors.
* **[NotesList.tsx](src/components/NotesList.tsx)**: View 1 (Listing Screen) component, carrying search bars, FlatList layout rendering, grid managers, and dark/light toggles.
* **[NoteEditor.tsx](src/components/NoteEditor.tsx)**: View 2 (Editor Screen) component, holding multiline inputs, category bubble selection rows, and safe area paddings.
* **[_layout.tsx](src/app/_layout.tsx)**: Configures Expo Router's `<Slot />` navigator to remove bottom tabs and top headers entirely, delivering a clean full-screen experience.
* **[theme.ts](src/constants/theme.ts)**: Declares optimized Light/Dark active slate palettes, spacing tokens, and device dimensions.

---

## ⚡ React Native & React Hooks Used

1. **`useColorScheme()`**: Inspects system-wide display preferences (light/dark mode) to set initial UI appearance defaults.
2. **`useWindowDimensions()`**: Manages responsive grid count calculations and caps the editor container to `800px` on wide screens to maintain typographic comfort.
3. **`useSafeAreaInsets()`**: Fetches screen hardware offsets (e.g. notches/home bars) to dynamically pad scrollables and headers.
4. **`useState()`**: Manages note states, search parameters, active screens, manual theme overrides, and chosen categories.
5. **`useEffect()`**: Automatically mounts note details into input fields upon editor screen focus.

---

## 🎨 Styling Rules & Alignment
* **100% StyleSheet compliance**: All styles are declared strictly via **`StyleSheet.create()`** to ensure memory and rendering optimization.
* **StyleSheet Compose (`StyleSheet.compose()`)**: Employed in `NotesList.tsx` to dynamically merge layout rules with active theme border colors.
* **StyleSheet Flatten (`StyleSheet.flatten()`)**: Employed in `NoteEditor.tsx` to safely resolve computed container margins and active border colors.

---

## 🚀 Running the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch the Application
Start the Expo bundler:
```bash
npx expo start
```

* Press **`w`** in the terminal to view the **Web version** in your browser.
* Press **`i`** in the terminal to launch the **iOS Simulator**.
* Press **`a`** in the terminal to launch the **Android Emulator**.
