import { useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { IoLogoWechat } from "react-icons/io5";
import { IconContext } from "react-icons";
import { CiLogout } from "react-icons/ci";
export default function Contacts({
  allUsers,
  onlinePeople,
  selectedId,
  setSelectedId,
  setUserSearchInput,
  setSelectedUserName,
  openMobileContact,
  setOpenMobileContact,
}) {
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
    setOpenMobileContact(false);
  };
  console.log(openMobileContact);
  return (
    <div className="chat-contact">
      <div className="chatContact-header">
        <span>
          <IconContext.Provider value={{ color: "white", size: "40px" }}>
            <IoLogoWechat />
          </IconContext.Provider>
        </span>
        <p>BlinkChat</p>
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
  );
}
