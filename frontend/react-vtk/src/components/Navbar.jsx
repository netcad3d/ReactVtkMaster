import React, { useState } from "react";

import { NavLink } from "react-router-dom";
import { Cross as Hamburger } from "hamburger-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="shadow-md z-20 w-full fixed top-0 left-0">
        <div className="md:flex items-center justify-between bg-secondary/60 py-4 ">
          <div className="font-bold text-2x1 cursor-pointer flex item-center text-white">
            <span className="text-3x1 mr-1 pt-0">
              <div className="flex">
                <NavLink
                  to="/"
                  style={{ color: "inherit", backgroundColor: "inherit" }}
                >
                  <img
                    src="https://assets.website-files.com/5f843092670b460a40be7d22/5fd8941bc89b53a151d3b1c0_netcad-logo.png"
                    alt="logo"
                    className="w-30 h-10 ml-3"
                  />
                </NavLink>
              </div>
            </span>
          </div>
          <div
            onClick={() => {
              setOpen((prev) => !prev);
            }}
            className="text-3x1  absolute right-8 top-4 cursor-pointer md:hidden"
          >
            <Hamburger className={open ? "close" : "menu"} color="#fff" />
          </div>
          <ul
            className={`md:flex mr-8 md:items-center md:pb-0 pb-12 absolute md:static 
           md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all 
          duration-500 ease-linear ${
            open
              ? "left-0 opacity-100 bg-secondary/30 top-[70px]"
              : "left-[-1400px] top-[70px]"
          } md:opacity-100 `}
          >
            <li className="flex mr-5 md:mt-2 mt-10 text-white">
              <NavLink
                className="text-sm flex items-center gap-x-4
                    cursor-pointer "
                to="/"
                style={{ color: "inherit", backgroundColor: "inherit" }}
              >
                <div
                  className={`flex md:ml-8 ml-0 md:block 
                  duration-500 text-lg hover:text-[#d5d4d4]`}
                >
                  Anasayfa
                </div>
              </NavLink>
            </li>
            <li className="flex mr-5 md:mt-2 mt-10 text-white">
              <NavLink
                className="text-sm flex items-center gap-x-4
                    cursor-pointer "
                to="/login"
                style={{ color: "inherit", backgroundColor: "inherit" }}
              >
                <div
                  className={`flex md:ml-8 ml-0 md:block 
                  duration-500 text-lg hover:text-[#d5d4d4]`}
                >
                  Giriş Yap
                </div>
              </NavLink>
            </li>
            <li className="flex mr-5 md:mt-2 mt-10 text-white">
              <NavLink
                className="text-sm flex items-center gap-x-4
                    cursor-pointer "
                to="/signup"
                style={{ color: "inherit", backgroundColor: "inherit" }}
              >
                <div
                  className={`flex md:ml-8 ml-0 md:block 
                  duration-500 text-lg hover:text-[#d5d4d4]`}
                >
                  Kaydol
                </div>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
