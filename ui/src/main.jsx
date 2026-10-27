import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { Provider } from "react-redux";
import { store } from "./store/store";
import { ApiProvider } from "./context/ApiProvider";
import { ConnectionProvider } from "./context/ConnectionContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ApiProvider>
        <ConnectionProvider>
          <App />
        </ConnectionProvider>
      </ApiProvider>
    </Provider>
  </StrictMode>,
);
