# Confession Manager

A modern, mobile-first Progressive Web App for managing confessions and spiritual guidance sessions. Built with React, TypeScript, and Capacitor for cross-platform deployment.

## Features

- 📱 **Mobile-First Design**: Optimized for touch interfaces and mobile devices
- 🌍 **Multi-Language Support**: English and Arabic language support
- 📅 **Appointment Management**: Schedule and track confession sessions
- 👥 **Person Directory**: Manage parishioners with detailed profiles
- 📊 **Reports & Analytics**: Visual insights into church activities
- 🗂️ **Categories & Groups**: Organize people by age groups and ministries
- 🔄 **Data Backup/Restore**: Export and import data as JSON/CSV
- 🔔 **Notifications**: Daily reminders for scheduled appointments
- 🌙 **Dark/Light Themes**: Multiple theme options including sepia
- ♿ **Accessibility**: RTL support for Arabic language

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **State Management**: React Context + Hooks
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Vite
- **Mobile**: Capacitor (PWA + Native Android)
- **Storage**: LocalStorage (with future IndexedDB migration)

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd confession-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

### Mobile App Development

#### PWA (Progressive Web App)
The app is already configured as a PWA and can be installed on mobile devices directly from the browser.

#### Android APK Build

1. Install Capacitor:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```

2. Build the web app:
   ```bash
   npm run build
   ```

3. Initialize Capacitor:
   ```bash
   npx cap init "Confession Manager" "com.confessionmanager.app" --web-dir=dist
   ```

4. Add Android platform:
   ```bash
   npx cap add android
   ```

5. Sync web assets:
   ```bash
   npx cap sync android
   ```

6. Open in Android Studio:
   ```bash
   npx cap open android
   ```

7. Build APK in Android Studio or via command line:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

The APK will be available at `android/app/build/outputs/apk/debug/app-debug.apk`

## App Structure

```
src/
├── components/          # Reusable UI components
├── views/              # Main app views/screens
│   ├── DirectoryView.tsx    # Person management
│   ├── AgendaView.tsx       # Appointment calendar
│   ├── ReportsView.tsx      # Analytics & reports
│   ├── SettingsView.tsx     # App configuration
│   ├── PersonProfileView.tsx # Individual profiles
│   └── TrashView.tsx        # Deleted items
├── store.tsx           # State management
├── types.ts            # TypeScript definitions
├── translations.ts     # Internationalization
└── App.tsx            # Main app component
```

## Key Features Implementation

### Person Management
- Add/edit/delete people with comprehensive profiles
- Category-based organization (Child, Youth, Adult, Elderly)
- Contact information and spiritual history tracking
- Bulk operations for multiple selections

### Appointment System
- Calendar and list views
- Individual and group sessions
- Attendance tracking
- Status management (Upcoming, Completed, Missed)
- Historical data preservation

### Data Persistence
- LocalStorage for client-side storage
- JSON export/import for backup
- CSV export for external analysis
- Automatic data validation

### Mobile Optimization
- Touch-friendly interface
- Safe area support for notched devices
- Offline functionality via Service Worker
- Installable PWA with app-like experience

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
