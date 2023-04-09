import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { apiLogin } from '../api/pokeAPI';

function BasicLogin() {

    const navigate = useNavigate();
    const [ data, setData ] = useState({
        username: "",
        password: ""
    });

    const [ credentialError, setCredentialError ] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        checkUser();
    };

    const checkUser = async () => {
        const { error, data: resData } = await apiLogin(data);

        if (!error && resData) {
            console.log(resData);
            setCredentialError(false);
            navigate("/");
            } else {
            setCredentialError(true);
            console.log("login failed");
        }
    };

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    useEffect(() => {}, [
        data.username,
        data.password,
      ]);

    return (
        <div style={{ textAlign: 'center' }}>
          
            <form onSubmit={handleSubmit}>
              <span> Login </span>
              <br />
              <input
                type="text"
                name="username"
                placeholder="username"
                onChange={changeHandler}
              />
              <br />
              <input
                type="password"
                name="password"
                placeholder="password"
                onChange={changeHandler}
              />
              <br />
              <button type="submit">
                Login
              </button>
            </form>
            {credentialError ? <h1>Credentials Entered Incorrectly</h1> : ''}
        </div>
      );
};

export default BasicLogin;