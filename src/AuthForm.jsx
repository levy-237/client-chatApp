import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function AuthForm() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [logButton, setLogButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setId, setUserName: setLoggedUser, id } = useContext(UserContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleForm = async (e) => {
    e.preventDefault();
    const url = logButton ? "login" : "register";
    if (username.length > 3 || password.length > 3) {
      try {
        setLoading(true);
        const { data } = await axios.post(url, { username, password });
        setLoggedUser(username);
        setId(data.id);
        setError(null);
        navigate("/");
      } catch (error) {
        setError("Invalid username or password. Please try different.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      setError("Username or Password should be at least 3 characters long.");
    }
  };
  return (
    <div className="register">
      {error && <p className="authError">{error}</p>}

      <section>
        <h3
          onClick={() => setLogButton(true)}
          style={{
            cursor: "pointer",
            borderBottom: logButton ? "3px solid white" : "white",
            paddingBottom: "5px",
          }}
        >
          Log in
        </h3>
        <h3
          onClick={() => setLogButton(false)}
          style={{
            cursor: "pointer",

            borderBottom: !logButton ? "3px solid white" : "white",
            paddingBottom: "5px",
          }}
        >
          Sign up
        </h3>
      </section>
      <form className="register-form" onSubmit={handleForm}>
        <input
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Username"
          type="text"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Passwrod"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : logButton ? "Log in " : "Sign up"}
        </button>
      </form>
    </div>
  );
}
