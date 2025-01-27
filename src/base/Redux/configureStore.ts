import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web and AsyncStorage for react
import thunk from "redux-thunk";

import reducer from "./reducers/rootReducer";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const persistConfig = {
  key: "comprehensive",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  persistedReducer,
  {},
  composeEnhancers(applyMiddleware(thunk)),
);

const persistor = persistStore(store);

export { store, persistor };
