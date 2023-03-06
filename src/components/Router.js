import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Nav from "../components/Nav";
import Profile from "../routes/Profile";
import styles from "../components/Router.module.css";
import { useState } from "react";

function AppRouter({ userObj, refreshRender }) {
  const [nowLocation, setNowLocation] = useState();
  return (
    <Router basename={process.env.PUBLIC_URL}>
      {userObj && <Nav userObj={userObj} nowLocation={nowLocation} />}
      <Routes>
        {userObj !== null ? (
          <>
            {userObj.displayName !== null ? (
              <Route
                path="/"
                element={
                  <Home userObj={userObj} setNowLocation={setNowLocation} />
                }
              />
            ) : (
              <Route
                path="/"
                element={
                  <Profile
                    userObj={userObj}
                    refreshRender={refreshRender}
                    setNowLocation={setNowLocation}
                  />
                }
              />
            )}
            <Route
              path="/profile"
              element={
                <Profile
                  userObj={userObj}
                  refreshRender={refreshRender}
                  setNowLocation={setNowLocation}
                />
              }
            />
            <Route path="/detail/:id" element={<Home userObj={userObj} />} />
            <Route path="*" element={<Navigate replace to="/" />} /> //위 경로
            외에 다른 링크로 갔을때 / 로 돌아감
          </>
        ) : (
          <>
            <Route path="/" element={<Auth />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default AppRouter;
