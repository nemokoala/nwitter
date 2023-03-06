import { useState, useEffect } from "react";
import { authService } from "../fbase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import styles from "routes/Auth.module.css";
function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(false);
  const [error, setError] = useState("");
  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    }
    if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (newAccount) {
        const data = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        );
      } else {
        const data = await signInWithEmailAndPassword(
          authService,
          email,
          password
        );
      }
    } catch (error) {
      setError(error.message);
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);

  const onSocialClick = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    await signInWithPopup(authService, provider);
  };

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <form onSubmit={onSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={onChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={onChange}
          />
          <input
            type="submit"
            style={
              newAccount
                ? { backgroundColor: "rgb(214, 250, 229)" }
                : { backgroundColor: "rgb(214, 216, 250)" }
            }
            value={newAccount ? "계정 생성" : "로그인"}
          />
          <div className={styles.error}>{error}</div>
          <div className={styles.switchBtn} onClick={toggleAccount}>
            {newAccount ? "로그인 전환" : "회원가입 전환"}
          </div>
        </form>
        <div className={styles.socialBtn}>
          <button name="google" onClick={onSocialClick}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/800px-Google_%22G%22_Logo.svg.png" />
            Continue with Google
          </button>
          <button name="github" onClick={onSocialClick}>
            <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" />
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
export default Auth;
