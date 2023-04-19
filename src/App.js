import React from "react";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import NoteState from "./context/notes/NoteState";
import  Alert  from "./components/Alert";
import Login from "./components/Login";
import Signup from "./components/Signup";
import FormHook from "./components/FormHook";

function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message,_type) =>{
    setAlert({msg:message,type:_type},
      setTimeout(()=>{
        setAlert(null);
      },1500)
      );
  }    
  
  return (
    <>
      <NoteState>
        <Navbar />
        <Alert alert={alert} />
        <div className="container">
          <Routes>
            <Route exact path="/" element={<Home showAlert={showAlert} />}></Route>
            <Route exact path="/about" element={<About />}></Route>
            <Route exact path="/login" element={<Login showAlert={showAlert} />}></Route>
            <Route exact path="/signup" element={<Signup showAlert={showAlert} />}></Route>
            <Route exact path="/formhook" element={<FormHook />}></Route>
          </Routes>
        </div>
      </NoteState>
    </>
  );
}

export default App;
