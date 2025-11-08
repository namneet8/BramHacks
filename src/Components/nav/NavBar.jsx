
import React, {useState } from "react";
import { Link } from "react-router-dom";
import {styles} from '../../styles.js';
import { navLinks } from "../../Constants/constants";
import { Icon, menu, close } from "../../assets";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);

  return (
    <nav
      className={`
      ${styles.paddingX} w-full flex items-center py-0
      fixed top-0 z-20 
    `}
    style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
    >
      <div className="w-full flex justify-between items-center max-w-7x1 mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <img src={Icon} alt={Icon} className="w-18 h-12 object-contain" />
          <p className="text-yellow-400 text-[18px] font-bold cursor-pointer flex">
          </p>
        </Link>
        <ul className="list-none hidden sm:flex flex-row gap-10"  style={{ color: '#b3286c' }}>
          {navLinks.map((link) => {
            return (
              <li
                key={link.id}
                className={`${
                  active === link.title ? "text-yellow-300" : "text-yellow-400"
                } hover:text-yellow-300 text-[24px] font-bold cursor-pointer `}
                onClick={() => setActive(link.title)}
              >
                <a href={`#${link.id}`}>{link.title}</a>
              </li>
            );
          })}
        </ul>
        <div className="sm:hidden flex flex-1 justify-end items-center">
          <img
            className="w-[28ox] h-[28px] pbject-contain cursor-pointer z-20 " 
            onClick={() => setToggle(!toggle)}
            src={toggle ? close : menu}
            alt={menu}
          />
          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } pt-15 p-6 black-gradient absolute top-1 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
          >
            <ul className="list-none flex justify-end items-start flex-col gap-4">
              {navLinks.map((link) => {
                return (
                  <li
                    key={link.id}
                    className={`${
                      active === link.title ? "text-yellow-400" : "text-yellow-200"
                    } font-poppins font-medium cursor-pointer text-[16px]`}
                    onClick={() => {
                      setActive(link.title);
                      setToggle(!toggle);
                    }}
                  >
                    <a href={`#${link.id}`}>{link.title}</a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;