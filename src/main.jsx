import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import './index.css';
import App from './App.jsx';
import './styles/global.css';
import './styles/tokens.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
);