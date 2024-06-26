"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "../../app/groups/groups.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";



function Nav() {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  };


  return (
    <div className={`container ${clicked ? "active" : ""}`}>
      <img src="/logo.jpeg" alt="logo" className="logo" />
      <div>
        <ul id="navbarElements" className={`${clicked ? "active" : ""}`}>

          <li>
            <a href="/calendar">Calendar</a>
          </li>
          <li>
            <a href="/events">Events</a>
          </li>
          <li>
            <Link href="/login">Login</Link>
          </li>
        </ul>
      </div>
      <div id="mobile">
        <FontAwesomeIcon
          icon={clicked ? faTimes : faBars}
          onClick={handleClick}
        />
      </div>
    </div>
  );
}

export default Nav;