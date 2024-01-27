import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [userName, setUserName] = useState();
  const [id, setId] = useState();

  /// Fetching user profile data and updating state with userId and username.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get("/profile");
        setId(data.data.userId);
        setUserName(data.data.username);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  console.log(userName);
  return (
    <UserContext.Provider value={{ userName, setUserName, setId, id }}>
      {children}
    </UserContext.Provider>
  );
}
