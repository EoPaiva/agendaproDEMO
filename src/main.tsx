import React from 'react';
import ReactDOM from 'react-dom/client';
import { installBetaMockApi } from './beta/mockApi';
import App from './App';
installBetaMockApi();

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
