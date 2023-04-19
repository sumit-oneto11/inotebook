import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const Signup = (props) => {
  const { register, handleSubmit, formState: { errors } } = useForm(); 
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    name: "",
    password: "",
  });

  const signUp = async (e) => {
    const response = await fetch("http://localhost:5000/api/auth/createUser/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: data.email, name: data.name, password: data.password }),
    });
    const json = await response.json();

    if (json.success) {
      localStorage.setItem("token", json.authToken);
      props.showAlert("Account Created Successfully.", "success");
      navigate("/");
    } else {
      console.log(json);
      props.showAlert(json.error, "danger");
    }
  };

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
    <form onSubmit={handleSubmit(signUp)}>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          {...register("email", { required: true}) }
          aria-describedby="emailHelp"
          value={data.email}
          onChange={onChange}
        />
        {errors.email && <span style={{color:'red'}}>This field is required.</span>}
      </div>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          {...register("name", {required: {value:true, message:"This field is required."}, minLength:{value:3, message:"Name should be atleast 3 character."}})}
          value={data.name}
          onChange={onChange}
        />
        {errors.name && <span style={{color:'red'}}>{errors.name.message}</span>}
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          {...register("password", {required: {value:true, message:"This field is required."}, minLength:{value:5, message:"Password should be atleast 5 character."}})}
          value={data.password}
          onChange={onChange}
        />
        {errors.password && <span style={{color:'red'}}>{errors.password.message}</span>}
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
    </div>
  );
};

export default Signup;
