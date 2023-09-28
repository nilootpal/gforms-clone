import React from 'react';
import './App.css';
import { 
  ChakraProvider,
  theme 
} from '@chakra-ui/react'
import { RouterProvider } from 'react-router-dom';
import { routes } from './routes/routes';

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <RouterProvider router={routes} />
    </ChakraProvider>
  );
}

export default App;
