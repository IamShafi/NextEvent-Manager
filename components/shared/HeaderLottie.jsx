"use client";
import React from "react";
import Lottie from "lottie-react";
import AnimationData from "/public/assets/Business Team.json";

const HeaderLottie = () => {
  return (
    <div>
       <Lottie animationData={AnimationData} width={450} height={450}/>
    </div>
  );
};

export default HeaderLottie;
