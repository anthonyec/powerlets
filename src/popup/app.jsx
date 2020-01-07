import React, { Suspense } from 'react';

import HomeScreen from './screens/home_screen';
const SettingsScreen = React.lazy(() => import('./screens/settings'));
const EditorScreen = React.lazy(() => import('./screens/editor_screen'));

import './reset.css';
import './app.css';

export default function App() {
  const path = window.location.hash.replace('#', '');
  const screens = {
    home: HomeScreen,
    settings: SettingsScreen,
    editor: EditorScreen,
  };

  const Screen = screens[path] ? screens[path] : screens.home;

  return (
    <div className="app">
      <Suspense fallback={<div>Loading...</div>}>
        <Screen />
      </Suspense>
    </div>
  );
}
