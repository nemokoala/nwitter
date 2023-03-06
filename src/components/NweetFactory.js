import { dbService, storageService } from "fbase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRef, useState } from "react";
import styles from "components/NweetFactory.module.css";
function NweetFactory({ userObj }) {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const [uploadDelay, setUploadDelay] = useState(false);

  const onSubmit = async (e) => {
    if (uploadDelay == false) {
      setUploadDelay(true);
      let attachmentUrl = "";
      if (attachment !== "") {
        const fileRef = ref(
          storageService,
          `${userObj.uid}/${Math.random(0, 100000)}`
        );
        const uploadFile = await uploadString(fileRef, attachment, "data_url");
        attachmentUrl = await getDownloadURL(uploadFile.ref);
      }

      if (attachment !== "" || nweet !== "") {
        await addDoc(collection(dbService, "nweets"), {
          text: nweet,
          createdAt: Date.now(),
          creatorId: userObj.uid,
          attachmentUrl,
          creatorName: userObj.displayName,
        });
        setUploadDelay(false);
        setNweet("");
        setAttachment("");
        fileInput.current.value = null;
      } else alert("업로드할 사진 또는 텍스트를 입력해주세요.");
    }
  };
  const testBtn = async (e) => {
    await setDoc(doc(dbService, "nweets", "koala", "111", "222"), {
      koala: "cute",
      aa: "ㅇㄹㄴ",
    });
  };
  const onChange = (e) => {
    setNweet(e.target.value);
  };

  const onFileChange = (e) => {
    const theFile = e.target.files[0];
    if (theFile.size > 5000000) {
      alert("5MB미만 파일만 업로드 해주세요.");
      setAttachment("");
      fileInput.current.value = null;
      return;
    } else {
      const reader = new FileReader();
      console.log(theFile.size);
      reader.onloadend = (finishedEvent) => {
        setAttachment(finishedEvent.currentTarget.result);
      };
      reader.readAsDataURL(theFile);
    }
  };
  const fileInput = useRef();
  const onClearAttachment = () => {
    setAttachment(null);
    fileInput.current.value = null;
  };

  const onClickImageUpload = () => {
    fileInput.current.click();
  };
  const onKeyDown = (e) => {
    if (e.key === "Enter") onSubmit();
  };
  return (
    <div className={styles.body}>
      <div className={styles.form} onSubmit={onSubmit}>
        <input
          type="text"
          value={nweet}
          placeholder="글 내용을 입력해주세요."
          maxLength={120}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />

        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
          style={{ display: "none" }}
        />
        <button className={styles.button} onClick={onClickImageUpload}>
          사진 업로드
        </button>

        {attachment && (
          <div className={styles.photoUpload}>
            <button
              className={styles.photoDelete}
              style={{ backgroundColor: "rgb(255, 118, 118)", color: "white" }}
              onClick={onClearAttachment}
            >
              사진 삭제
            </button>
            <img src={attachment} />
          </div>
        )}
        <button
          className={styles.button}
          style={
            uploadDelay
              ? {
                  backgroundColor: "gray",
                  color: "white",
                  margin: "20px 0",
                }
              : {
                  backgroundColor: "rgb(101, 149, 212)",
                  color: "white",
                  margin: "20px 0",
                }
          }
          onClick={onSubmit}
        >
          {uploadDelay ? "업로드 중..." : "글 작성"}
        </button>
        <button onClick={testBtn}>테스트</button>
      </div>
    </div>
  );
}
export default NweetFactory;
