import { useContext, useRef } from "react";
import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { uniqBy } from "lodash";
import Contacts from "./components/Contacts";
import ChatSection from "./components/ChatSection";
import MobileContacts from "./components/MobileContacts";
export default function Chat() {
  const [wsConnection, setWsConnection] = useState();
  const [onlinePeople, setOnlinePeople] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [userSearchInput, setUserSearchInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [searchUserMessage, setSearchUserMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openMobileContact, setOpenMobileContact] = useState(true);
  const { userName, id, setId, setUserName } = useContext(UserContext);

  const underMessageRef = useRef();

  ///handling message based on the json sent from backend
  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);
    if ("online" in messageData) {
      onlinePpl(messageData.online);
    } else if ("text" in messageData) {
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  };

  const onlinePpl = (pplArr) => {
    const people = {};
    pplArr.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  };

  ///creating websocket connection and setting up listeners
  const connectWs = () => {
    const ws = new WebSocket(import.meta.env.VITE_WEBSOKCET_URL);
    setWsConnection(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => setTimeout(connectWs, 1000));
  };
  ///establishing WS connection
  useEffect(() => {
    connectWs();
  }, []);

  /// sending message by webSockets and updating message state making
  ///sure input is empty
  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessageText.trim() !== "") {
      wsConnection.send(
        JSON.stringify({
          recipient: selectedId,
          text: newMessageText,
        })
      );
      setNewMessageText("");
      const input = document.getElementById("form-input");
      input.value = "";
      setMessages((prev) => [
        ...prev,
        {
          text: newMessageText,
          sender: id,
          recipient: selectedId,
          _id: Date.now(),
        },
      ]);
      setErrorMessage("");
    } else {
      setErrorMessage("CAN NOT SEND EMPTY MESSAGE");
    }
  };

  ///scrolling to bottom of the chat to display new message when new message
  ///is sent in users chat
  useEffect(() => {
    const refer = underMessageRef.current;
    if (refer) {
      refer.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  ///fetching old message so user can see history of chat(old messages)
  useEffect(() => {
    const fetchData = async () => {
      if (selectedId) {
        const response = await axios.get(
          `/messages/${selectedId}?text=${searchUserMessage}`
        );
        setMessages(response.data);
      }
    };
    fetchData();
  }, [selectedId, searchUserMessage]);

  ////making sure messages don't get duplicated
  const messageDisplay = messages.reduce((uniqueMessages, msg) => {
    const existingMessage = uniqueMessages.find((m) => m._id === msg._id);
    if (!existingMessage) {
      return [...uniqueMessages, msg];
    }
    return uniqueMessages;
  }, []);
  /// fetching data of all people in chat app
  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get(`/people?username=${userSearchInput}`);
      ///making sure user doesn't display itself
      const filteredUsers = data.data.filter((obj) => obj._id !== id);
      setAllUsers(filteredUsers);
    };
    fetchData();
  }, [onlinePeople, userSearchInput]);
  return (
    <div className="chat-page">
      <Contacts
        allUsers={allUsers}
        onlinePeople={onlinePeople}
        selectedId={selectedId}
        setSelectedUserName={setSelectedUserName}
        setSelectedId={setSelectedId}
        setUserSearchInput={setUserSearchInput}
        openMobileContact={openMobileContact}
        setOpenMobileContact={setOpenMobileContact}
      />
      <MobileContacts
        allUsers={allUsers}
        onlinePeople={onlinePeople}
        selectedId={selectedId}
        setSelectedUserName={setSelectedUserName}
        setSelectedId={setSelectedId}
        setUserSearchInput={setUserSearchInput}
        openMobileContact={openMobileContact}
        setOpenMobileContact={setOpenMobileContact}
      />
      <ChatSection
        underMessageRef={underMessageRef}
        selectedId={selectedId}
        messageDisplay={messageDisplay}
        sendMessage={sendMessage}
        newMessageText={newMessageText}
        setNewMessageText={setNewMessageText}
        selectedUserName={selectedUserName}
        searchUserMessage={searchUserMessage}
        setSearchUserMessage={setSearchUserMessage}
        errorMessage={errorMessage}
        openMobileContact={openMobileContact}
        setOpenMobileContact={setOpenMobileContact}
      />
    </div>
  );
}
