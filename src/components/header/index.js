import React, { useState } from "react";
import Styles from "./Header.module.css";

const index = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className={Styles.navbar}>
      <div className={Styles.container}>
        <section className={Styles.wrapper}>
          <a href="/" className={Styles.brand}>
            ProjectX
          </a>
          <button
            type="button"
            className={`${Styles.burger} ${
              isOpen ? Styles.burger_isactive : null
            }`}
            id="burger"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={Styles.burgerline}></span>
            <span className={Styles.burgerline}></span>
            <span className={Styles.burgerline}></span>
            <span className={Styles.burgerline}></span>
          </button>
          <div
            className={`${Styles.menu} ${
              isOpen ? Styles.menu_isactive : null
            }}`}
            id="menu"
          >
            <ul className={Styles.menuinner}>
              <li className={Styles.menuitem}>
                <a href="/dashboard" className={Styles.menulink}>
                  Home
                </a>
              </li>
              {user.role === "ADMIN" ? (
                <>
                  <li className={Styles.menuitem}>
                    <a
                      href="/dashboard/assign-tasks"
                      className={Styles.menulink}
                    >
                      Assign Tasks
                    </a>
                  </li>
                  <li className={Styles.menuitem}>
                    <a
                      href="/dashboard/create-user"
                      className={Styles.menulink}
                    >
                      Create User
                    </a>
                  </li>
                  <li className={Styles.menuitem}>
                    <a
                      href="/dashboard/take-attendance"
                      className={Styles.menulink}
                    >
                      Attendance
                    </a>
                  </li>
                  <li className={Styles.menuitem}>
                    <a
                      href="/dashboard/users"
                      className={Styles.menulink}
                    >
                      Users
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li className={Styles.menuitem}>
                    <a href="/dashboard/attendance" className={Styles.menulink}>
                      Attendance
                    </a>
                  </li>
                </>
              )}
              <li className={Styles.menuitem}>
                ({user?.name}){" "}
                <a href="/logout" className={Styles.menulink}>
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
