import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
const Admin = () => {
  const [data, setData] = useState([]);


  // function to get all users
  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
        console.log(list);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
 
//   delete user from db with id 
const handleDelete = async (id) => {
       try {
         await deleteDoc(doc(db, "users", id));
         setData(data.filter((item) => item.id !== id));
       } catch (err) {
         console.log(err);
       }
     };
   


  return <>
  <button >delete</button>
  <div>
      
  </div>
  </>
};

export default Admin;
