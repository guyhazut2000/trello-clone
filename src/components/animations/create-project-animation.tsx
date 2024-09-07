"use client";

import Lottie from "lottie-react";

import Animation from "../../../public/static/create-project-animation.json";

export const CreateProjectAnimation = () => {
  return <Lottie className="max-w-[500px]" animationData={Animation} />;
};
