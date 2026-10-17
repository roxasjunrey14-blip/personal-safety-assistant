# 🎓 Oral Defense & Code Explanation Guide
### Activity: Personal Safety Assistant (IT313)
**Teacher:** Aladdin A. Buwanding  
**Rubric Category:** Code Explanation (10 Points) + Flux/Redux Architecture (20 Points)

Use this guide during your evaluation when the instructor asks you to walk through the app and explain your code.

---

## 1. High-Level Architecture Walkthrough
When asked: *"Explain how your app is structured."*

**Your Answer:**
> "Sir, our application strictly follows a 3-Layer Architecture to maintain separation of concerns, high maintainability, and clean code:
>
> 1. **Presentation Layer (`src/presentation/`):**
>    - Contains our screens (`DashboardScreen`, `LocationScreen`, `CameraIncidentScreen`, `ContactsScreen`, `LogsScreen`).
>    - Houses 5 reusable UI components (`StatusBadge`, `CustomButton`, `ContactCard`, `IncidentCard`, `LocationCard`) which receive props for flexible customization and reusability.
>
> 2. **Business Layer (`src/business/`):**
>    - Houses our central **Redux Toolkit Store** (`store.js`) and 4 domain slices:
>      - `safetySlice.js` (Manages SAFE, WARNING, EMERGENCY states and SOS triggers)
>      - `locationSlice.js` (Manages GPS coordinates, accuracy, permissions, reverse geocoding)
>      - `contactSlice.js` (Manages emergency contacts list)
>      - `incidentSlice.js` (Manages incident reports and photo evidence)
>    - Implements unidirectional Flux data flow with Redux `createAsyncThunk` for asynchronous operations.
>
> 3. **Data Layer (`src/data/`):**
>    - Implemented in `storageService.js` using `@react-native-async-storage/async-storage`.
>    - Encapsulates all persistent storage operations (save/load for status, contacts, incidents, and audit logs) so the UI never touches storage directly."

---

## 2. Flux / Redux Flow Explanation
When asked: *"Show me where and how Flux / Redux is implemented."*

**Show this file:** `src/business/store.js` and `src/business/slices/safetySlice.js`

**Your Answer:**
> "Sir, here is our unidirectional Redux data flow:
> 1. **Action Dispatch:** When the user presses the 'TRIGGER EMERGENCY SOS' button in `DashboardScreen.js`, it dispatches the action:
>    ```javascript
>    dispatch(updateSafetyStatusThunk({ status: 'EMERGENCY', reason: 'USER PRESSED SOS' }));
>    ```
> 2. **Async Middleware / Thunk:** The thunk calls `storageService.saveSafetyStatus('EMERGENCY')` to guarantee persistence.
> 3. **Reducer:** The `extraReducers` in `safetySlice.js` catches the `fulfilled` action and updates `state.status = 'EMERGENCY'` immutably.
> 4. **Store & Selectors:** All subscribed components listening via `useSelector((state) => state.safety.status)` automatically re-render immediately with the red emergency theme."

---

## 3. Reusable Components & Props (Rubric Requirement)
When asked: *"Show me your reusable components and how props are used."*

**Show these components:**
1. **`src/presentation/components/CustomButton.js`**
   - Props: `title`, `onPress`, `variant` (primary/danger/warning/outline), `icon`, `loading`, `disabled`.
   - Used in all screens for uniform styling, loading indicators, and tactile feedback.
2. **`src/presentation/components/StatusBadge.js`**
   - Props: `status` ('SAFE' | 'WARNING' | 'EMERGENCY'), `title`, `description`, `iconName`.
   - Changes colors, pulsing indicator, and icons dynamically depending on the passed status prop.
3. **`src/presentation/components/ContactCard.js`**
   - Props: `id`, `name`, `phone`, `relationship`, `isPrimary`, `onCall`, `onDelete`.
   - Reused across the Dashboard and Contacts screen.
4. **`src/presentation/components/IncidentCard.js`**
   - Props: `id`, `title`, `description`, `timestamp`, `severity`, `imageUri`, `latitude`, `longitude`, `onDelete`.
   - Reused in the Incident reporter to display evidence with images and GPS coordinates.
5. **`src/presentation/components/LocationCard.js`**
   - Props: `latitude`, `longitude`, `accuracy`, `address`, `status`, `errorMessage`, `onRefreshLocation`.
   - Displays real-time GPS metadata and handles denied permission states.

---

## 4. Native Features Explanation

### A. Camera & Image Picker
**Show file:** `src/presentation/screens/CameraIncidentScreen.js`
- **Permissions:** Uses `ImagePicker.requestCameraPermissionsAsync()` and `requestMediaLibraryPermissionsAsync()`.
- **Handling Denied Permissions:** If status !== 'granted', sets `permissionError` state and alerts the user with guidance to enable it.
- **Capture:** Launches camera with `ImagePicker.launchCameraAsync()` or gallery with `launchImageLibraryAsync()`.
- **Persistence:** Passes photo URI into `saveIncidentThunk` which persists in AsyncStorage.

### B. GPS / Geolocation
**Show file:** `src/business/slices/locationSlice.js` and `src/presentation/screens/LocationScreen.js`
- **Permissions:** Uses `Location.requestForegroundPermissionsAsync()`.
- **Handling Denied Permissions:** If denied, dispatches `rejectWithValue({ type: 'PERMISSION_DENIED' })`, displaying the red permission denied warning banner.
- **Coordinates & Geocoding:** Retrieves `coords.latitude`, `coords.longitude`, `accuracy`, and executes `Location.reverseGeocodeAsync()` for the real human-readable street/city address.
- **Simulation Tool:** Includes built-in buttons ("Set Metro Manila GPS" / "Set Cebu City GPS") to ensure 100% testability even on emulators or indoors.

### C. Persistent Storage
**Show file:** `src/data/storageService.js`
- Uses `@react-native-async-storage/async-storage`.
- Provides asynchronous JSON serialization/deserialization for emergency contacts, incident reports with images, and safety audit logs.
- Data remains intact even when closing and reopening the app.

---

## 5. Live Demonstration Script for Aladdin A. Buwanding

Follow these exact steps during your demonstration:
1. **Show Dashboard:**
   - Point out the title "Personal Safety Assistant".
   - Show the green status badge (`SAFE`).
   - Click "Caution Alert" -> Watch the status badge turn amber/orange (`WARNING`).
   - Click "TRIGGER EMERGENCY SOS" -> Watch the status badge turn red (`EMERGENCY`) and top status bar turn red.
   - Click "Mark as Safe" -> Returns to green (`SAFE`).
2. **Show GPS Screen:**
   - Tap "GPS" tab at the bottom.
   - Click "Refresh GPS" to show real-time coordinates, accuracy, and address.
   - Show the "Broadcast GPS to Contacts" button.
3. **Show Camera & Incident Screen:**
   - Tap "Incident" tab.
   - Enter a title (e.g. "Road Hazard / Suspicious Vehicle").
   - Click "Take Photo" or "Choose Photo" to attach evidence.
   - Notice the current GPS coordinates are automatically attached!
   - Click "Save & Submit Incident Report".
   - Show the newly created `IncidentCard` with the photo preview, timestamp, and geotag.
4. **Show Contacts Screen:**
   - Tap "Contacts" tab.
   - Show default emergency hotlines (911, Philippine Red Cross).
   - Click "＋ Add Emergency Contact", fill in a name and number, toggle "Primary", and save.
   - Show the call button and delete button.
5. **Show Logs Screen:**
   - Tap "Logs" tab.
   - Point to the "Layered Architecture Breakdown" section displayed right in the app.
   - Show the chronological audit trail of all actions you just performed!
