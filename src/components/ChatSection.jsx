import { IoIosSend } from "react-icons/io";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import { RiAttachment2 } from "react-icons/ri";
import { FaFileUpload } from "react-icons/fa";
import { IconContext } from "react-icons";
import { IoIosArrowBack } from "react-icons/io";
export default function ChatSection({
  selectedId,
  messageDisplay,
  underMessageRef,
  sendMessage,
  newMessageText,
  setNewMessageText,
  selectedUserName,
  searchUserMessage,
  setSearchUserMessage,
  errorMessage,
  openMobileContact,
  setOpenMobileContact,
}) {
  const { userName, id, setId, setUserName } = useContext(UserContext);
  return (
    <div className="chatSection">
      {!selectedId && (
        <div className="noSelectedUser">
          <span>No selected user</span>
          <p onClick={() => setOpenMobileContact(true)}>click to open chats</p>
        </div>
      )}
      {selectedUserName ? (
        <section className="chatSection-header">
          <section>
            <span
              className="chatSection-close"
              onClick={() => setOpenMobileContact(true)}
            >
              <IconContext.Provider value={{ size: "30px" }}>
                <IoIosArrowBack />
              </IconContext.Provider>
            </span>
            <span className="chatUserAvatar-initial">
              {selectedUserName.slice(0, 1).toUpperCase()}
            </span>
            <p>{selectedUserName}</p>
          </section>
          <input
            placeholder="Search in chat.."
            type="text"
            onChange={(e) => setSearchUserMessage(e.target.value)}
          />
        </section>
      ) : null}
      {selectedId && (
        <div className="messageDiv-wrapper">
          {messageDisplay.map((msg, i) => (
            <div
              key={i}
              className={`messageDiv ${msg.sender === id ? `byMe` : `byOpp`}`}
            >
              <p>{msg.text}</p>
            </div>
          ))}
          <div ref={underMessageRef}></div>
        </div>
      )}
      {messageDisplay.length === 0 && (
        <h1 className="noMessage">NO MESSAGES FOUND</h1>
      )}
      {errorMessage && (
        <p style={{ color: "red", marginTop: "auto" }}>{errorMessage}</p>
      )}
      {selectedId && (
        <form className="chat-inputDiv" onSubmit={sendMessage}>
          <label className="chatInputAttachment">
            <input type="file" />
            <IconContext.Provider value={{ size: "2.7rem", color: "#0A74FF" }}>
              <RiAttachment2 />
            </IconContext.Provider>
          </label>
          <input
            id="form-input"
            type="text"
            onChange={(e) => setNewMessageText(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit">
            <IconContext.Provider value={{ size: "2rem", color: "black" }}>
              <IoIosSend />
            </IconContext.Provider>
          </button>
        </form>
      )}
    </div>
  );
}
