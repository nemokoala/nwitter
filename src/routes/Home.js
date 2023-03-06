import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { authService, dbService } from "fbase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "routes/Home.module.css";
function Home({ userObj, setNowLocation }) {
  const [nweets, setNweets] = useState([]);

  useEffect(() => {
    setNowLocation("Home");
    //데이터 다운로드
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      //로그아웃시 오류 안뜨게
      const nweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArr);
    }); //asc 올림차 desc 내림차

    onAuthStateChanged(authService, (user) => {
      if (user == null) {
        unsubscribe();
      }
    });
  }, []);

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <NweetFactory userObj={userObj} />

        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOnwer={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
}
export default Home;
