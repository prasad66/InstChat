import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import ChatProvider from './Context/ChatProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <ChatProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ChatProvider>
  </Router>
);

serviceWorkerRegistration.register();
// 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