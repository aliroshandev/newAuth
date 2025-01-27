import React, { lazy, useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import LogoutPage from "base/pages/LogoutPage/LogoutPage";
import LoginPage from "base/pages/LoginPage/LoginPage";
import NotFound from "base/pages/NotFound";
import { useSelector } from "react-redux";
import DashboardPage from "./base/pages/DashboardPage/DashboardPage";
import CustomSpinner from "base/components/CustomSpinner/CustomSpinner";
import useSessionStorageState from "base/hooks/useSessionStorage";

function Routes() {
  const { accessibleApps } = useSelector((state) => state.user);
  const [token] = useSessionStorageState("token");
  if (!token) {
    setTimeout(() => {
      if (!token) {
        // window.location = "http://192.168.4.20:3001/logout";
      }
    }, 200);
  }

  return (
    <Switch>
      {accessibleApps?.map((app) => (
        <Route
          key={`/${app.client}`}
          path={`/${app.name}`}
          component={() => ShowView(app.url)}
        />
      ))}
      <Route path="/" component={DashboardPage} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/logout" component={LogoutPage} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
}

export default React.memo(Routes);

function ShowView(cmpPath) {
  let convertedPath = cmpPath.split("http://")?.[1];
  const [views, setViews] = useState([]);
  const importView = (path) => {
    return lazy(() =>
      import(`${path}`).catch((e) => {
        return import("base/pages/NotFound");
      })
    );
  };
  useEffect(() => {
    async function loadView() {
      const View = await importView(convertedPath);
      setViews(<View key={convertedPath} />);
    }
    loadView();
  }, [cmpPath, convertedPath]);
  return (
    <React.Suspense fallback={<CustomSpinner size="small" />}>
      <div>{views}</div>
    </React.Suspense>
  );
}
