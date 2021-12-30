/* eslint-disable */
import React, { useState } from "react";

const index = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="container">
        <section className="wrapper">
          <a href="/" className="brand">
            ProjectX
          </a>
          <button
            type="button"
            className={`burger ${
              isOpen ? "isactive" : null
            }`}
            id="burger"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="burgerline"></span>
            <span className="burgerline"></span>
            <span className="burgerline"></span>
            <span className="burgerline"></span>
          </button>
          <div
            className={`menu ${
              isOpen ? "isactive" : null
            }`}
            id="menu"
          >
            <ul className="menuinner">
              <li className="menuitem">
                <a href="/dashboard" className="menulink">
                  Home
                </a>
              </li>
              {user.role === "ADMIN" ? (
                <>
                  <li className="menuitem">
                    <a
                      href="/dashboard/assign-tasks"
                      className="menulink"
                    >
                      Assign Tasks
                    </a>
                  </li>
                  <li className="menuitem">
                    <a
                      href="/dashboard/create-user"
                      className="menulink"
                    >
                      Create User
                    </a>
                  </li>
                  <li className="menuitem">
                    <a
                      href="/dashboard/take-attendance"
                      className="menulink"
                    >
                      Attendance
                    </a>
                  </li>
                  <li className="menuitem">
                    <a
                      href="/dashboard/users"
                      className="menulink"
                    >
                      Users
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li className="menuitem">
                    <a href="/dashboard/attendance" className="menulink">
                      Attendance
                    </a>
                  </li>
                </>
              )}
              <li className="menuitem">
                ({user?.name}){" "}
                <a href="/logout" className="menulink">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </nav>
  );
};

export default index;
