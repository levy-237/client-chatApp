import { useContext, useRef, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { IoLogoWechat } from "react-icons/io5";
import { IconContext } from "react-icons";
import { CiLogout } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";

export default function MobileContacts({
  allUsers,
  onlinePeople,
  selectedId,
  setSelectedId,
  setUserSearchInput,
  setSelectedUserName,
  openMobileContact,
  setOpenMobileContact,
}) {
  const mobileRef = useRef(null);
  const { userName, id, setId, setUserName } = useContext(UserContext);
  ///logging user out
  const logout = async () => {
    await axios.post("/logout");
    setId(null);
    setUserName(null);
  };

  const handleUserClick = (id, nameOfSelected) => {
    setSelectedId(id);
    setSelectedUserName(nameOfSelected);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileRef.current && !mobileRef.current.contains(event.target)) {
        setOpenMobileContact(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpenMobileContact]);

  return (
    <>
      {openMobileContact && (
        <div className="mobile-Contact">
          <div className="chat-mobileContact" ref={mobileRef}>
            <div className="chatContact-header">
              <span>
                <IconContext.Provider value={{ color: "white", size: "40px" }}>
                  <IoLogoWechat />
                </IconContext.Provider>
              </span>
              <p>BlinkChat</p>
              <span
                className="mobileContact-close"
                onClick={() => setOpenMobileContact(false)}
              >
                <IconContext.Provider value={{ color: "white", size: "40px" }}>
                  <IoCloseOutline />
                </IconContext.Provider>
              </span>
            </div>
            <span className="signInAs">Signed in as : {userName}</span>
            <div className="user-searchDiv">
              <input
                placeholder="Search for the user.."
                type="text"
                onChange={(e) => setUserSearchInput(e.target.value)}
              />
            </div>
            {allUsers
              .sort((a, b) => {
                const aIsOnline = Object.keys(onlinePeople).includes(a._id);
                const bIsOnline = Object.keys(onlinePeople).includes(b._id);
                return bIsOnline - aIsOnline;
              })
              .map((user, i) => (
                <div
                  onClick={() => handleUserClick(user._id, user.username)}
                  key={i}
                  className={`userAvatar  ${
                    selectedId === user._id ? "selected" : ``
                  }`}
                >
                  <span className="userAvatar-initial">
                    {user.username.slice(0, 1).toUpperCase()}
                    <div
                      className={`onlineIndicator ${
                        Object.keys(onlinePeople).includes(user._id)
                          ? `online`
                          : `offline`
                      }`}
                    ></div>
                  </span>

                  <h1>{user.username}</h1>
                </div>
              ))}
            <section className="logout" onClick={logout}>
              <span>
                <IconContext.Provider value={{ size: "30px" }}>
                  <CiLogout />
                </IconContext.Provider>
              </span>
              <span>Log out</span>
            </section>
          </div>
        </div>
      )}
    </>
  );
}
