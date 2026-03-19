"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect, useContext } from "react";
import { AppContext } from "../context/Appcontext";
import Link from "next/link";
import { MdOutlineFileDownload } from "react-icons/md";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null);
  const {
    user,
    logout,
    deleteprofile: deleteProfileFunc,
  } = useContext(AppContext);
  const [deleteprofile, setDeleteprofile] = useState(false);

  useEffect(() => {
    if (deleteprofile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [deleteprofile]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  useEffect(() => {
    if (showLogoutConfirm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showLogoutConfirm]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setIsOpen(false);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const result = await deleteProfileFunc(user._id);

      if (result && result.status === "success") {
        setDeleteprofile(false);
        logout();
      } else {
        alert(result?.message || "Failed to delete account. Please try again.");
        setDeleteprofile(false);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
      setDeleteprofile(false);
    }
  };

  const getInitials = () => {
    if (!user?.name && !user?.username) return "U";
    const name = user?.name || user?.username;
    return name.charAt(0).toUpperCase();
  };

  const handledelete = () => {
    setDeleteprofile(true);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-7 h-7 sm:w-9 sm:h-9 bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] cursor-pointer rounded-full flex items-center justify-center hover:bg-[#99AEFF] transition-all duration-200 shadow-lg"
        >
          <span className="text-base sm:text-xl text-white font-semibold">
            {getInitials()}
          </span>
        </button>

        {isOpen && (
          <div className="absolute right-0 top-12 sm:top-14 w-[280px] sm:w-[300px] md:w-[320px] bg-[#12171B] rounded-xl sm:rounded-2xl shadow-2xl border border-[#0A090C] shadow-md overflow-hidden z-50 animate-slideDown">
            <div className="p-2 sm:p-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg sm:text-xl text-white font-bold">
                    {getInitials()}
                  </span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="text-white font-semibold text-sm sm:text-base truncate">
                    {user?.name || user?.username || "User"}
                  </h3>
                  <p className="text-white text-xs sm:text-sm truncate">
                    {user?.email || "No email"}
                  </p>
                </div>
              </div>
              <div className="border-b border-[#EAEAEA80] w-1/1 mx-auto mt-4"></div>
            </div>

            <div className="py-1 sm:py-2">
              <button className="w-full cursor-pointer px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 hover:bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] transition-all duration-200 group">
                <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/svgs/Terms-of-Service.svg"
                    alt="Terms of Use"
                    width={18}
                    height={18}
                    className="object-contain w-full h-full"
                  />
                </div>
                <Link
                  href="/conditions"
                
                  className="text-white font-medium text-xs sm:text-sm"
                >
                  Terms of Use
                </Link>
              </button>
              <button className="w-full cursor-pointer px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 hover:bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] transition-all duration-200 group">
                <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/svgs/Private-Policy.svg"
                    alt="Privacy Policy"
                    width={18}
                    height={18}
                    className="object-contain w-full h-full"
                  />
                </div>
                <Link
                  href="/privecypolice"
                  className="text-white font-medium text-xs sm:text-sm"
                >
                  Privacy Policy
                </Link>
              </button>
              <Link
                href={
                  "https://apps.apple.com/us/app/pixelift-ai-photo-enhancer/id6748871047"
                }
                target="_blank"
                className="flex-1 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 cursor-pointer hover:bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] transition-all duration-200 group"
              >
                <MdOutlineFileDownload className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0" />
                <span className="text-white font-medium text-xs sm:text-sm">
                  Get App
                </span>
              </Link>
              <button
                onClick={handledelete}
                className="w-full cursor-pointer px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 hover:bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] transition-all duration-200 group"
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/svgs/Delete-Account.svg"
                    alt="Help Center"
                    width={18}
                    height={18}
                    className="object-contain w-full h-full"
                  />
                </div>
                <span className="text-red-500 font-medium text-xs sm:text-sm">
                  Delete Account
                </span>
              </button>
              <button
                onClick={handleLogoutClick}
                className="w-full cursor-pointer px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 hover:bg-gradient-to-r from-[#3B7FFF] to-[#2CAA78] transition-all duration-200 group"
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/svgs/Log-out.svg"
                    alt="Logout"
                    width={18}
                    height={18}
                    className="object-contain w-full h-full"
                  />
                </div>
                <span className="text-white font-medium text-xs sm:text-sm">
                  Log out
                </span>
              </button>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-slideDown {
            animation: slideDown 0.2s ease-out;
          }
        `}</style>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          ></div>
          <div className="relative bg-[#12171B] border border-[#EAEAEA80] rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 w-[90%] sm:w-[85%] max-w-md animate-popupSlide mx-4">
            <h2 className="text-lg sm:text-xl font-bold text-white text-center mb-2">
              Logout
            </h2>
            <h3 className="text-sm sm:text-base text-white text-center mb-4 sm:mb-6 px-2">
              Are you sure you want to logout from your account?
            </h3>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={handleCancelLogout}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 cursor-pointer bg-gray-600 hover:bg-gray-600 text-white font-semibold rounded-lg sm:rounded-xl text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 cursor-pointer bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg sm:rounded-xl text-sm sm:text-base"
              >
                Yes, Logout
              </button>
            </div>
          </div>

          <style jsx>{`
            @keyframes popupSlide {
              from {
                opacity: 0;
                transform: scale(0.9) translateY(-20px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }

            .animate-popupSlide {
              animation: popupSlide 0.3s ease-out;
            }
          `}</style>
        </div>
      )}

      {deleteprofile && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setDeleteprofile(false)}
          ></div>
          <div className="relative bg-[#12171B] border border-[#EAEAEA80] rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 w-[90%] sm:w-[85%] max-w-md animate-popupSlide mx-4">
            <h2 className="text-lg sm:text-xl font-bold text-white text-center mb-2">
              Delete Account
            </h2>
            <h3 className="text-sm sm:text-base text-white text-center mb-4 sm:mb-6 px-2 leading-relaxed">
              Are you sure you want to delete your account? This action cannot
              be undone and all your data will be permanently deleted.
            </h3>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => setDeleteprofile(false)}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 cursor-pointer bg-gray-600 hover:bg-gray-600 text-white font-semibold rounded-lg sm:rounded-xl text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 cursor-pointer bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl text-sm sm:text-base"
              >
                Yes, Delete
              </button>
            </div>
          </div>

          <style jsx>{`
            @keyframes popupSlide {
              from {
                opacity: 0;
                transform: scale(0.9) translateY(-20px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }

            .animate-popupSlide {
              animation: popupSlide 0.3s ease-out;
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default ProfileDropdown;
