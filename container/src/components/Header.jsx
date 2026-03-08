import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.scss";

export default function Header() {
  return (
    <header className="shell-header">
      <div className="shell-header__brand">
        <span className="shell-header__logo">🛡️</span>
        <h1 className="shell-header__title">SecureLife Insurance</h1>
      </div>
      <nav className="shell-header__nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `shell-header__link ${isActive ? "shell-header__link--active" : ""}`
          }
        >
          📋 Policy Dashboard
        </NavLink>
        <NavLink
          to="/payment"
          className={({ isActive }) =>
            `shell-header__link ${isActive ? "shell-header__link--active" : ""}`
          }
        >
          💳 Pay Premium
        </NavLink>
      </nav>
    </header>
  );
}
