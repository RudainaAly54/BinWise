import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import RecycleCamera from "../components/RecycleCamera";
import { FcIdea } from "react-icons/fc";
import { GiProgression } from "react-icons/gi";

const RecycleScanner = () => {
  const [selected, setSelected] = useState("Paper");

  const tips = {
    Plastic: ["Rinse bottles", "Remove caps", "Do not recycle bags"],
    Paper: ["Remove staples", "Avoid wet paper", "Flatten boxes"],
    Glass: ["Rinse jars", "Remove lids", "Do not include broken glass"],
    Metal: ["Rinse cans", "Avoid aerosol cans", "Crush cans"],
  };

  const dailyGoal = 5;
  const completed = 3;
  const progressPercent = (completed / dailyGoal) * 100;

  return (
    <section className="bg-gray-100 overflow-x-hidden">
      <NavBar />
      <div className="p-6">
        <h1 className="text-3xl font-bold">Smart Recycling Center</h1>
        <p className="text-gray-600">AI-powered recognition to identify recyclable materials</p>

        <div className="flex flex-col gap-10 md:flex-row lg:flex-row mt-6">

          
          <RecycleCamera />

          <div className="flex flex-col gap-8 min-w-[30%]">
            {/* Tips */}
            <div className="border rounded-xl p-3 bg-white border-gray-300">
              <div className="flex items-center gap-1 p-1">
                <FcIdea className="text-2xl" />
                <h3 className="font-semibold text-xl">Recycling Tips</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 m-1 mb-4">
                {["Plastic", "Paper", "Glass", "Metal"].map(type => (
                  <button
                    key={type}
                    onClick={() => setSelected(type)}
                    className={`py-2 rounded-xl font-medium ${selected === type ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <ul className="space-y-2">
                {tips[selected].map((tip, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✔</span>{tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Progress */}
            <div className="border rounded-xl p-3 bg-white border-gray-300">
              <div className="flex gap-1 items-center mb-3">
                <GiProgression className="text-xl mb-3 text-yellow-400" />
                <h2 className="text-lg font-semibold mb-3">Today's Progress</h2>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                Daily Goal <span className="font-medium">{completed}/{dailyGoal} items</span>
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                <div className="bg-black h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <p className="text-green-600 text-3xl font-bold">{completed * 5}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default RecycleScanner;
