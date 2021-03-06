import { merge } from "lodash";
import firebase from "./firebase";
import "firebase/firestore";

const firestore = firebase.firestore();

export function createUser(uid, data) {
  return firestore
    .collection("user")
    .doc(uid)
    .set(
      {
        uid,
        ...data,
      },
      { merge: true }
    );
}
