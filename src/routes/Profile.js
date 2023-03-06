import { authService, dbService } from "fbase";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";
import Nweet from "components/Nweet";
import styled from "styled-components";

function Profile({ userObj, refreshRender, setNowLocation }) {
  const [newDisplayName, setNewDisplayName] = useState(
    userObj.displayName ? userObj.displayName : ""
  );
  const [myNweets, setMyNweets] = useState([]);

  const navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/aa");
  };
  const getMyNweets = async () => {
    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
      setMyNweets((prev) => [...prev, { id: doc.id, ...doc.data() }]);
      console.log(myNweets);
    });
  };

  useEffect(() => {
    setNowLocation("Profile");
    getMyNweets();
  }, []);

  const onChange = (e) => setNewDisplayName(e.target.value);
  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName && newDisplayName !== "") {
      //이름바꾸기
      await updateProfile(userObj, { displayName: newDisplayName });
      refreshRender();
      alert(`이름이 ${userObj.displayName}으로 변경되었습니다.`);
    } else alert("이름이 이전과 같거나 빈칸이면 안됩니다.");
  };

  return (
    <div className={styles.body}>
      <form onSubmit={onSubmit} className={styles.form}>
        <h2 style={{ color: "white" }}>이름 변경</h2>
        <input
          type="text"
          placeholder="이름을 입력해주세요."
          onChange={onChange}
          value={newDisplayName}
        />
        <input type="submit" value="확인" />
        <button onClick={onLogOutClick}>로그아웃</button>
      </form>
      <Div>
        <hr />
        <H2>내가 작성한 글</H2>
        {myNweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOnwer={nweet.creatorId === userObj.uid}
          />
        ))}
      </Div>
    </div>
  );
}

const Div = styled.div`
  width: 500px;
`;
const H2 = styled.h2`
  color: white;
  text-align: center;
`;
export default Profile;
