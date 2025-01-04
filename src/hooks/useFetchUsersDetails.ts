import { useEffect, useMemo, useState } from "react";
import { collection, getFirestore, getDocs } from "firebase/firestore";
import firebaseApp from "@chat/services/firebase";
import { User } from "firebase/auth";

const useFetchUserDetails = () => {
  const db = useMemo(() => getFirestore(firebaseApp), []);

  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoading] = useState<boolean>(false);

  // Fetch user details from Firestore for each sender
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersCollection = collection(db, "users");
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map((doc) => ({
          uid: doc.id,
          displayName: doc.data().displayName,
          email: doc.data().email,
          phoneNumber: doc.data().phoneNumber,
        })) as User[];
        setUsers(userList);
      } catch (err: any) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [db]);

  // Handle message submission

  return { users, loadingUsers };
};

export default useFetchUserDetails;
