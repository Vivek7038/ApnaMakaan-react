import { FcHome } from "react-icons/fc";
import React, { useState, useEffect } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./../firebase";
import ListingItem from "../components/ListingItem";

const Profile = () => {
  const auth = getAuth();
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;
  function onEdit(listingID) {
    navigate(`/edit-listing/${listingID}`);
  }
  // delete listing 
  async function onDelete(listingID) {
    if (window.confirm("Are you sure you want to delete ? ")) {
      await  deleteDoc (doc(db , "listings" , listingID))
      const  updatedListings= listings.filter(
        (listing) => listing.id !==listingID
      )
      setListings(updatedListings)
      toast.success("successfully deleted the listing")
    }
  }
  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  function onChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit() {
    try {
      if (auth.currentUser.displayName !== name) {
        // update display name  in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        // update  name in firestore
        const docref = doc(db, "users ", auth.currentUser.uid);
        await updateDoc(docref, {
          name,
        });
      }
      toast.success("Profile details updated");
    } catch (error) {
      toast.error("could not update profile ");
    }
  }

  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      // only show  listing  created by current user 
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);
  return (
    <>
      <section className="max-w-6xl mx-auto  flex justify-center items-center flex-col">
        <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3 ">
          {/* user Profile section  */}
          <form>
            <input
              type="text"
              id="name"
              value={name}
              onChange={onChange}
              disabled={!changeDetail}
              className={`w-full px-4 py-2 text-xl text-gray-700 bg-white  border border-gray-300 mb-6 rounded transition ease-in-out ${
                changeDetail && "bg-red-200 focus:bg-red-200 "
              }`}
            />
            <input
              type="email"
              id="email"
              value={email}
              disabled={!changeDetail}
              onChange={onChange}
              className="w-full px-4 py-2 text-xl text-gray-700 mb-6 bg-white  border border-gray-300  rounded transition ease-in-out "
            />
            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
              <p className="flex items-center ">
                Do you want to change your name ?
                <span
                  onClick={() => {
                    changeDetail && onSubmit();
                    setChangeDetail((prev) => !prev);
                  }}
                  className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1   cursor-pointer  "
                >
                  {changeDetail ? "Apply Change" : " Edit"}
                </span>
              </p>

              <p
                onClick={onLogout}
                className="text-blue-600 hover:text cursor-pointer"
              >
                Sign out
              </p>
            </div>
          </form>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800"
          >
            <Link
              to="/create-listing"
              className="flex justify-center items-center"
            >
              <FcHome className="mr-2 text-3xl bg-red-200 rounded-full p-1 border-2" />
              Sell or rent your home
            </Link>
          </button>
        </div>
      </section>
      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6">
              My Listings
            </h2>
            <ul className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
