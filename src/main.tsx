import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

// components
import { App } from "./app.tsx";

// styles
import "./normalize.css";
import "./index.css";

// store
import store from "./store/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
