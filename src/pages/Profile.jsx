import React, { useState } from "react";
import { getAuth } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const auth=getAuth()
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = formData;
  async function  onLogout(){
     try{
      await auth.signOut();
      navigate("/sign-in")
  toast("signned out successfully")

     }catch(error){
  toast.error(error.message)
     }
  }
  return (
    <section className="max-w-6xl mx-auto  flex justify-center items-center flex-col">
      <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
      <div className="w-full md:w-[50%] mt-6 px-3 ">
        {/* user Profile section  */}
        <form>
          <input
            type="email"
            id="email"
            value={email}
            disables
            className="w-full px-4 py-2 text-xl text-gray-700 mb-6 bg-white  border border-gray-300  rounded transition ease-in-out "
          />
          <input
            type="text"
            id="name"
            value={name}
            disables
            className="w-full px-4 py-2 text-xl text-gray-700 bg-white  border border-gray-300 mb-6 rounded transition ease-in-out "
          />
          <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
            <p className="flex items-center ">Do you want to change your name ?
            <span className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1   cursor-pointer "> Edit </span></p>
            <p onClick={onLogout}className="text-blue-600 hover:text cursor-pointer">Sign out</p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Profile;
