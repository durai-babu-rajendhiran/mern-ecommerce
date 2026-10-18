import React from "react";
import Typewriter from "typewriter-effect";

const Jumbotron = ({ text }) => (
  <div className="d-inline-block text-crimson fw-bold">
    <Typewriter
      options={{
        strings: text,
        autoStart: true,
        loop: true,
        delay: 60,
        deleteSpeed: 35,
      }}
    />
  </div>
);

export default Jumbotron;
