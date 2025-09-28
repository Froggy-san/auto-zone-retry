import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className=" border-t-8 border-primary  p-5 flex gap-5">
      <ul className=" space-y-3">
        <li>
          <Link href="">Vehicle Make</Link>
        </li>
        <li>
          <Link href="">Vehicle Make</Link>
        </li>
        <li>
          <Link href="">Vehicle Make</Link>
        </li>
        <li>
          <Link href="">Vehicle Make</Link>
        </li>
        <li>
          <Link href="">Vehicle Make</Link>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
