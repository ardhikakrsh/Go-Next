import React, { SyntheticEvent, useState } from "react";
import Nav from "../components/user/Nav";
import axios from "axios";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { login } from "../store/user";
import { setLeave } from "../store/leave";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleButton = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/auth/signup",
        { username, password, first_name: firstName, last_name: lastName },
        { withCredentials: true }
      );
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-2">
      <Nav />
      <div className="hero min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="card flex-shrink-0 w-96 shadow-2xl bg-base-100">
            <form className="card-body">
              <h1 className="text-3xl font-bold text-center">Sign up now!</h1>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  placeholder="username"
                  className="input input-bordered"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="password"
                  className="input input-bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* <label className="label">
                                    <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                                </label> */}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  placeholder="First name"
                  className="input input-bordered"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="input input-bordered"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary" onClick={handleButton}>
                  SIGN UP
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
