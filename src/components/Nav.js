import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "components/Nav.module.css";
function Nav({ userObj, nowLocation }) {
  return (
    <nav>
      <ul>
        <li
          style={
            nowLocation === "Home"
              ? { backgroundColor: "rgb(181, 181, 233)" }
              : {}
          }
        >
          <Link to="/">Home</Link>
        </li>
        <li
          style={
            nowLocation === "Profile"
              ? { backgroundColor: "rgb(181, 181, 233)" }
              : {}
          }
        >
          <Link to="/profile">
            {userObj?.displayName ? userObj.displayName : "유저"}의 프로필
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
