import React, { useState, useEffect } from "react";
import axios from "axios";
import { CiDiscount1 } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { FaGifts } from "react-icons/fa6";
import { PiPlantFill } from "react-icons/pi";
import { FaMedal } from "react-icons/fa6";
import { FaFire } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState("activity");
  const [activities, setActivities] = useState([]);
  const [user, setUser] = useState(null);
  const [daysRecycled, setDaysRecycled] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch profile data
        const profileRes = await axios.get("http://localhost:5000/api/auth/profile", {
          withCredentials: true,
        });
        if (profileRes.data.success) setUser(profileRes.data.userData);

        // Fetch pickups data
        const pickupsRes = await axios.get("http://localhost:5000/api/pickups/my", {
          withCredentials: true,
        });
        
        if (pickupsRes.data.success) {
          const pickups = pickupsRes.data.pickups;
          
          // ✅ Map activities - show ALL pickups with their status and potential/awarded points
          const mappedActivities = pickups.map((pickup) => {
            const status = pickup.status.charAt(0).toUpperCase() + pickup.status.slice(1);
            const points = pickup.awardedPoints || 0;
            const isCompleted = pickup.status === "completed";
            
            return {
              action: `Pickup ${status}`,
              date: pickup.createdAt,
              points: points, // ✅ Fixed: lowercase 'points'
              isCompleted: isCompleted,
              status: pickup.status,
              items: pickup.items || [],
            };
          });
          
          setActivities(mappedActivities);
          
          // ✅ Calculate unique days recycled (only count completed pickups)
          const completedPickups = pickups.filter(p => p.status === "completed");
          const uniqueDays = new Set(
            completedPickups.map((p) => new Date(p.createdAt).toDateString())
          );
          setDaysRecycled(uniqueDays.size);
          
          console.log("📊 Activities loaded:", mappedActivities.length);
          console.log("🎯 Completed pickups:", completedPickups.length);
          console.log("📅 Unique recycling days:", uniqueDays.size);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const rewards = [
    {
      title: "Discount Voucher",
      desc: "10% off your next purchase",
      icon: <CiDiscount1 className="text-red-600 text-4xl" />,
      pointsCost: 1000,
    },
    {
      title: "Bonus Points",
      desc: "+500 points for consistent recycling",
      icon: <FaHeart className="text-green-600 text-4xl" />,
      pointsCost: 2000,
    },
    {
      title: "Free Gift",
      desc: "Reusable water bottle",
      icon: <FaGifts className="text-[#C2A070] text-4xl" />,
      pointsCost: 1500,
    },
  ];

  const achievements = [
    {
      title: "Eco Starter",
      desc: "Completed your first recycling activity",
      icon: <PiPlantFill className="text-green-800 text-4xl" />,
      unlocked: activities.some(a => a.isCompleted),
    },
    {
      title: "Green Hero",
      desc: "Recycled 100+ items",
      icon: <FaMedal className="text-yellow-500 text-4xl" />,
      unlocked: (user?.points || 0) >= 1000, // Approximate based on points
    },
    {
      title: "Streak Master",
      desc: "Recycled for 7 days in a row",
      icon: <FaFire className="text-orange-500 text-4xl" />,
      unlocked: daysRecycled >= 7,
    },
  ];

  const greenMessage = (
    <div className="mt-6 bg-green-200 text-green-900 text-sm font-medium p-4 rounded-lg text-center">
      <b>Great Job this week!</b> You are on a {daysRecycled}-day recycling streak!
      <br />
      Keep it up – you're only{" "}
      <b>{Math.max(0, 5000 - (user?.points || 0))} points</b> away from reaching the next level!
    </div>
  );

  console.log("Days Recycled in ProfileTabs:", daysRecycled);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mt-10 bg-white rounded-4xl shadow-md p-4 sm:p-6">
      {/* Tabs Navigation */}
      <div className="bg-gray-200 rounded-4xl p-1 flex justify-between">
        {[
          { key: "activity", label: "Recent Activity" },
          { key: "rewards", label: "Rewards" },
          { key: "achievements", label: "Achievements" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`w-1/3 py-2 text-xs sm:text-base font-semibold capitalize transition-all duration-300
              ${
                activeTab === tab.key
                  ? "bg-white text-gray-900 shadow-md rounded-4xl"
                  : "bg-gray-200 text-gray-700 rounded-4xl"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* ✅ Activity Tab - Enhanced */}
        {activeTab === "activity" && (
          <>
            {activities.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No activity yet. Start recycling today!
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {activities.map((item, i) => (
                  <div
                    key={i}
                    className={`flex flex-col sm:flex-row justify-between items-start sm:items-center rounded-lg p-3 sm:p-4 transition ${
                      item.isCompleted
                        ? "bg-green-50 hover:bg-green-100 border border-green-200"
                        : item.status === "assigned"
                        ? "bg-blue-50 hover:bg-blue-100 border border-blue-200"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-800">
                          {item.action}
                        </p>
                        {/* Status Badge */}
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            item.status === "completed"
                              ? "bg-green-200 text-green-800"
                              : item.status === "assigned"
                              ? "bg-blue-200 text-blue-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                      {/* Show items */}
                      {item.items.length > 0 && (
                        <p className="text-xs text-gray-600 mt-1">
                          Items: {item.items.map(i => i.type).join(", ")}
                        </p>
                      )}
                    </div>
                    
                    {/* Points Display */}
                    {item.points > 0 && (
                      <div className="flex flex-col items-end gap-1 mt-2 sm:mt-0">
                        <span
                          className={`text-sm font-semibold px-3 py-1 rounded-full shadow-sm ${
                            item.isCompleted
                              ? "bg-green-200 text-green-800"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {item.isCompleted ? "+" : "~"}{item.points} pts
                        </span>
                        {!item.isCompleted && (
                          <span className="text-xs text-gray-500">
                            (pending)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {greenMessage}
          </>
        )}

        {/* Rewards Tab */}
        {activeTab === "rewards" && (
          <>
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Your Points:</span> {user?.points || 0} points
              </p>
            </div>
            <h3 className="text-gray-800 font-semibold mb-4">
              Redeem your points for amazing rewards
            </h3>
            <div className="grid grid-cols-1  sm:grid-cols-1 md:grid-cols-3 gap-4">
              {rewards.map((reward, i) => {
                const canAfford = (user?.points || 0) >= reward.pointsCost;
                return (
                  <div
                    key={i}
                    className={`flex flex-col items-center p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition ${
                      canAfford ? "bg-green-50" : "bg-gray-100"
                    }`}
                  >
                    <div className="mb-2">{reward.icon}</div>
                    <h4 className="text-lg font-semibold text-gray-800 text-center">
                      {reward.title}
                    </h4>
                    <p className="text-sm text-gray-600 text-center mb-2">
                      {reward.desc}
                    </p>
                    <button
                      disabled={!canAfford}
                      className={`mt-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                        canAfford
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {reward.pointsCost} pts
                    </button>
                  </div>
                );
              })}
            </div>
            {greenMessage}
          </>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <>
            <h3 className="text-gray-800 font-semibold mb-4">
              Your Achievements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((ach, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition ${
                    ach.unlocked ? "bg-yellow-50 border-2 border-yellow-400" : "bg-gray-100 opacity-60"
                  }`}
                >
                  <div className="mb-2 relative">
                    {ach.icon}
                    {ach.unlocked && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 text-center">
                    {ach.title}
                  </h4>
                  <p className="text-sm text-gray-600 text-center">
                    {ach.desc}
                  </p>
                  {ach.unlocked && (
                    <span className="mt-2 text-xs font-medium text-green-600">
                      Unlocked! 🎉
                    </span>
                  )}
                </div>
              ))}
            </div>
            {greenMessage}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileTabs;