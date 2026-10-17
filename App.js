import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/business/store';
import MainApp from './src/presentation/MainApp';

/**
 * Root Application Component
 * Supplies the Redux Store to the entire application tree.
 */
export default function App() {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}
