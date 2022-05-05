import { Button } from '@chakra-ui/react';
import { Route } from 'react-router-dom';
import './App.css';
import Homepage from './Pages/Homepage';
import ChatPage from './Pages/ChatPage';

function App() {

  return (
    <div className="App">
      <Route exact path="/" component={Homepage}  />
      <Route path="/chats" component={ChatPage} />
    </div>

  );
}

export default App;
