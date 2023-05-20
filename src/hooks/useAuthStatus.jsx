import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";


  //  custom hook for checking the auth status
 const useAuthStatus = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setcheckingStatus] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) =>{
       if(user){
              setLoggedIn(true)
       }
       setcheckingStatus(false)
    },[])

  });
  return  {loggedIn , checkingStatus};
};

export default useAuthStatus;
