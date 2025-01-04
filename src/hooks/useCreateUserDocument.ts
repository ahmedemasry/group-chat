import { useEffect } from "react";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import firebaseApp from "@chat/services/firebase";
import { User } from "firebase/auth";

const useCreateUserDocument = (user: User | undefined | null) => {
  const db = getFirestore(firebaseApp);

  useEffect(() => {
    if (user) {
      const userRef = doc(db, "users", user.uid);

      // Check if the user document exists, if not, create one
      setDoc(
        userRef,
        {
          uid: user.uid,
          displayName: user.displayName, // You can update later if user updates the name
          email: user.email,
          createdAt: new Date(),
          phoneNumber: user.phoneNumber,
        },
        { merge: true }
      )
        .then(() => {
          console.log("User document created/updated in Firestore");
        })
        .catch((error) => {
          console.error("Error creating user document: ", error);
        });
    }
  }, [user, db]);
};

export default useCreateUserDocument;
