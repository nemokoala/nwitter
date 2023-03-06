import AppRouter from "./Router";
import { useState, useEffect } from "react";
import { authService } from "../fbase";
function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [updateState, setUpdateState] = useState(false);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj(user);
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshRender = () => setUpdateState((prev) => !prev);
  return (
    <>
      {init ? (
        <AppRouter userObj={userObj} refreshRender={refreshRender} />
      ) : (
        "Initializing.."
      )}
    </>
  );
}

export default App;
