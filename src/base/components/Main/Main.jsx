import React, { useEffect, useState } from "react";

import { ErrorBoundary } from "react-error-boundary";

import TopMenu from "base/components/TopMenu/TopMenu";
import { store } from "base/Redux/configureStore";
import "./Main.scss";

import { useGetApiCall } from "base/hooks/useGetApiCall";
import ErrorSection from "../ErrorSection/ErrorSection";
import { useDispatch, useSelector } from "react-redux";
import {
  ACT_SetUserInfo,
  ACT_SetAccessToken,
  ACT_SetRefreshToken,
} from "base/Redux/action-creators";
import RightMenu from "../RightMenu/RightMenu";
import useSessionStorageState from "../../hooks/useSessionStorage";
import { useHistory } from "react-router";
import jwtDecode from "jwt-decode";
import ManageSystems from "ManageSystems/ManageSystems";
import CustomSpinner from "../CustomSpinner/CustomSpinner";
import Login from "../../../ManageSystems/components/Login/Login";

function Main() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isSettingToken, setIsSettingToken] = useState(true);
  const [token, setToken] = useSessionStorageState("token");
  const [, setRefreshToken] = useSessionStorageState("refreshToken");

  const [decodedToken, setDecodedToken] = useState();
  useEffect(() => {
    if (token) {
      setDecodedToken(jwtDecode(token));
    }
  }, [token]);

  const selectedApp = useSelector((state) => state.user.selectedApp);
  const [isMenuCollapsed, setIsMenuCollapsed] = React.useState(false);
  const [darkTheme, setDarkTheme] = React.useState(
    store.getState().app.darkTheme
  );
  const handleToggleBurgerBtn = () => {
    setIsMenuCollapsed(!isMenuCollapsed);
  };

  const saveTokenHandler = async (data) => {
    try {
      let param = await new Proxy(
        new URLSearchParams(window.location?.search),
        {
          get: (searchParam, props) => searchParam.get(String(props)),
        }
      );
      setToken(param.token);
      setRefreshToken(param.refreshToken);

      dispatch(ACT_SetUserInfo({ userName: decodedToken?.preferred_username }));
      dispatch(ACT_SetAccessToken(param.token));
      dispatch(ACT_SetRefreshToken(param.refreshToken));
    } catch (err) {
      console.log(err);
    } finally {
      setIsSettingToken(false);
      await history.push("/dashboard");
    }
  };

  useEffect(() => {
    if (
      window.location.pathname === "/" &&
      window.location?.search?.length > 10
    ) {
      saveTokenHandler();
    } else if (!token) {
      setIsSettingToken(false);
      history.push("/login");
    } else {
      setIsSettingToken(false);
    }
  }, [history, setRefreshToken, setToken]);

  useEffect(() => {
    document.addEventListener(
      "onUpdateTheme",
      function (e) {
        setDarkTheme(e.detail);
      },
      false
    );
  }, []);

  return (
    <>
      {isSettingToken ? (
        <CustomSpinner />
      ) : (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div className={`App ${darkTheme ? "dark" : "light"}`}>
            <ProtectedRoute>
              <TopMenu toggleBurgerBtn={handleToggleBurgerBtn} />
              <div className="wrapper">
                <RightMenu isMenuCollapsed={isMenuCollapsed} />
                <div className="mainSection">
                  <ManageSystems />
                </div>
              </div>
            </ProtectedRoute>
          </div>
        </ErrorBoundary>
      )}
    </>
  );
}

export default Main;

function ErrorFallback({ error }) {
  return (
    <div role="alert">
      <h2>
        مشکلی در سامانه به وجود آمده. لطفا این مورد را به پشتیبانی گزارش کنید
      </h2>
      <pre style={{ color: "red", textAlign: "center", marginTop: "22px" }}>
        {error.message}
      </pre>

      <p>صفحه را مجدد بارگزاری کنید</p>
    </div>
  );
}

const ProtectedRoute = ({redirectPath = "/login", children}) => {
  const [token, setToken] = useSessionStorageState("token");
  if (!token) {
    console.log(token, "token")
    return <Login/>;
  } else {
    return <>{children}</> ;
  }
};