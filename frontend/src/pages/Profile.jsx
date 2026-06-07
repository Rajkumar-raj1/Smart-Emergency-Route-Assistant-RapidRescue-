import { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPlus,
  FaTrash,
  FaSave,
} from "react-icons/fa";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const {
    user,
    updateProfile,
    addEmergencyContact,
    deleteEmergencyContact,
  } = useAuth();

  const [profileData, setProfileData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  const [contactData, setContactData] = useState({
    name: "",
    relation: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactChange = (e) => {
    setContactData({
      ...contactData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await updateProfile(profileData);
      alert("Profile updated successfully");
    } catch (error) {
      alert(error?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();

    try {
      await addEmergencyContact(contactData);

      setContactData({
        name: "",
        relation: "",
        phone: "",
      });

      alert("Emergency contact added");
    } catch (error) {
      alert(error?.message || "Failed to add contact");
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!confirm("Delete this emergency contact?")) return;

    try {
      await deleteEmergencyContact(contactId);
      alert("Emergency contact deleted");
    } catch (error) {
      alert(error?.message || "Failed to delete contact");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <section className="bg-white rounded-2xl shadow-md p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div className="bg-blue-100 text-blue-600 w-24 h-24 rounded-full flex items-center justify-center text-5xl">
              <FaUser />
            </div>

            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
                {user?.fullName || "RapidRescue User"}
              </h1>

              <p className="text-gray-500 mt-2">
                Manage your profile and emergency contacts
              </p>

              <p className="flex items-center gap-2 text-gray-600 mt-3">
                <FaEnvelope className="text-blue-600" />
                {user?.email || "Not available"}
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white rounded-2xl shadow-md p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-5">
              Edit Profile
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone
                </label>

                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <div className="px-4 text-gray-500">
                    <FaPhone />
                  </div>

                  <input
                    type="text"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>

                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <div className="px-4 text-gray-500">
                    <FaMapMarkerAlt />
                  </div>

                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 outline-none"
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
              >
                <FaSave />
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </section>

          <section className="bg-white rounded-2xl shadow-md p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-5">
              Add Emergency Contact
            </h2>

            <form onSubmit={handleAddContact} className="space-y-5">
              <input
                type="text"
                name="name"
                placeholder="Contact Name"
                value={contactData.name}
                onChange={handleContactChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="text"
                name="relation"
                placeholder="Relation e.g. Father, Brother"
                value={contactData.relation}
                onChange={handleContactChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={contactData.phone}
                onChange={handleContactChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
              >
                <FaPlus />
                Add Contact
              </button>
            </form>
          </section>
        </div>

        <section className="bg-white rounded-2xl shadow-md p-6 md:p-8 mt-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-5">
            Saved Emergency Contacts
          </h2>

          {!user?.emergencyContacts?.length ? (
            <div className="bg-gray-50 rounded-xl p-5 border text-gray-500">
              No emergency contacts added.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.emergencyContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="bg-gray-50 rounded-xl p-5 border flex items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {contact.name}
                    </h3>

                    <p className="text-gray-600 mt-1">
                      {contact.relation || "Emergency Contact"}
                    </p>

                    <p className="text-blue-600 font-semibold mt-2">
                      {contact.phone}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteContact(contact._id)}
                    className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white p-3 rounded-full transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Profile;