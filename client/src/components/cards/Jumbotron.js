import React from "react";
import Typewriter from "typewriter-effect";

const Jumbotron = ({ text }) => (
  <div className="jumbotron jumbotron-fluid text-center py-5 bg-primary text-white">
    <div className="container">
      <h1 className="display-4 mb-4">Welcome to Our Website!</h1>
      <div className="d-flex justify-content-center align-items-center">
        <Typewriter
          options={{
            strings: text,
            autoStart: true,
            loop: true,
            delay: 75, // Adjust typing speed
            deleteSpeed: 50, // Adjust deleting speed
          }}
        />
      </div>
    </div>
  </div>
);


export default Jumbotron;
