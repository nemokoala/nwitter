import { dbService, storageService } from "fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";
import styles from "components/Nweet.module.css";

function Nweet({ nweetObj, isOnwer }) {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const date = new Date(nweetObj.createdAt);

  const onDeleteClick = async () => {
    const NweetDiv = doc(dbService, "nweets", `${nweetObj.id}`);
    const ok = window.confirm("이 글을 지우시겠습니까?");
    if (ok) {
      await deleteDoc(NweetDiv);
      if (nweetObj.attachmentUrl !== "")
        await deleteObject(ref(storageService, nweetObj.attachmentUrl));
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);
  const onChange = (e) => {
    setNewNweet(e.target.value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const NweetDiv = doc(dbService, "nweets", `${nweetObj.id}`);
    await updateDoc(NweetDiv, { text: newNweet });
    setEditing(false);
  };
  return (
    <div className={styles.container}>
      {editing ? (
        <>
          <form onSubmit={onSubmit} className={styles.editForm}>
            <input type="text" value={newNweet} required onChange={onChange} />
            <input type="submit" value="업데이트" />
            <button onClick={toggleEditing}>취소</button>
          </form>
        </>
      ) : (
        <>
          {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} />}
          <div className={styles.text}>
            {date.toLocaleDateString()} - {nweetObj.creatorName} <br />
            <hr />
            {nweetObj.text}
          </div>
          {isOnwer && (
            <div className={styles.buttons}>
              <button onClick={toggleEditing} style={{ color: "blue" }}>
                수정
              </button>
              <button onClick={onDeleteClick} style={{ color: "red" }}>
                삭제
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Nweet;
