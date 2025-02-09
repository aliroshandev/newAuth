import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "antd/dist/antd.css";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import locale from "antd/lib/locale-provider/fa_IR";
import { ConfigProvider } from "antd";
import { store, persistor } from "base/Redux/configureStore";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ConfigProvider locale={locale} direction={"rtl"}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter basename="/roles">
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </ConfigProvider>
);
