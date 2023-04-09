import React, { useState, useEffect } from 'react';
import { apiSignup } from '../api/pokeAPI';

function Signup() {

    const [data, setData] = useState({
        username: "",
        password: "",
        email: ""
      });

    const handleSubmit = (e) => {
        e.preventDefault();
        return apiSignup(data);
    };

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    useEffect(() => {}, [
        data.username,
        data.password,
        data.email
      ]);

      console.log(data);
    
    return (
        <div style={{ textAlign: 'center' }}>
          
            <form onSubmit={handleSubmit}>
              <span> Admin Signup </span>           
              <br />
              <input
                type="text"
                name="username"
                placeholder="username"
                onChange={changeHandler}
              />
              <br />
              <input
                type="text"
                name="email"
                placeholder="email"
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
                Signup
              </button>
            </form>
          
        </div>
      );
}

export default Signup;