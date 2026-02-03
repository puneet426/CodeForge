import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // REPLACE WITH YOUR ACTUAL GOOGLE SHEET ID
  const SHEET_ID = "1EuuFzU6CCENRwWUDgAKnpLs-07TgVq8Yaazs27gmJTI";
  // REPLACE WITH THE EXACT NAME OF YOUR SHEET TAB
  const SHEET_NAME = "Leaderboard"; 

  useEffect(() => {
    fetch(`https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("Sheet Error:", data);
          setLoading(false);
          return; 
        }

        // Filter empty names and sort by Total_Score
        const validData = data.filter(student => student.Name && student.Name.trim() !== "");
        const sortedData = validData.sort((a, b) => b.Total_Score - a.Total_Score);
        
        // Assign Rank
        const rankedData = sortedData.map((student, index) => ({
          ...student,
          rank: index + 1,
          // Generate GitHub avatar URL safely
          avatarUrl: student.Github_Username 
            ? `https://github.com/${student.Github_Username}.png`
            : `https://api.dicebear.com/7.x/initials/svg?seed=${student.Name}` // Fallback image
        }));
        
        setStudents(rankedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching leaderboard:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="min-h-screen bg-forge-dark flex items-center justify-center text-forge-yellow font-mono animate-pulse">Loading Scores...</div>;

  // Slice top 3 and the rest
  const topThree = [students[0], students[1], students[2]]; // Ensure array exists even if empty
  const restList = students.slice(3);

  return (
    <div className="min-h-screen bg-forge-dark bg-dot-pattern text-white font-mono pt-24 pb-12 px-4 md:px-8">
      
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
          &lt;Top Performers/&gt;
        </h1>
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
           Compete Code Conquer.
        </p>
      </div>

      {/* ================= NEW PODIUM SECTION (Top 3) ================= */}
      {/* items-end aligns them at the bottom to create steps */}
      <div className="flex justify-center items-end gap-4 md:gap-8 mb-16 max-w-3xl mx-auto">
        
        {/* === Rank 2 (Left - Silver) === */}
        {topThree[1] && (
          <div className="flex-1 flex flex-col items-center bg-black/40 border border-gray-500/30 rounded-t-2xl md:rounded-t-3xl p-4 pb-0 backdrop-blur-sm z-10 shadow-[0_-5px_30px_rgba(192,192,192,0.4)]">
            {/* Avatar Container */}
            <div className="relative mb-3">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-gray-300 overflow-hidden shadow-[0_0_15px_rgba(192,192,192,0.4)]">
                <img src={topThree[1].avatarUrl} alt={topThree[1].Name} className="w-full h-full object-cover" />
              </div>
              {/* Rank Badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-300 text-black w-8 h-8 flex items-center justify-center rounded-full font-black border-2 border-forge-dark">
                2
              </div>
            </div>
            {/* Text Info */}
            <h3 className="font-bold text-base md:text-lg mt-4 text-center truncate w-full">{topThree[1].Name}</h3>
            <p className="text-2xl md:text-3xl font-black text-gray-300 my-1">{topThree[1].Total_Score}</p>
            <p className="text-gray-500 text-xs md:text-sm mb-4 pb-4">@{topThree[1].Github_Username}</p>
          </div>
        )}

        {/* === Rank 1 (Center - Gold - Biggest) === */}
        {topThree[0] && (
          // Taller container (-mt-12), higher z-index, prominent yellow border
          <div className="flex-1 flex flex-col items-center bg-black/40 border border-forge-yellow/40 rounded-t-2xl md:rounded-t-[40px] p-4 pb-0 backdrop-blur-sm -mt-12 z-20 shadow-[0_-5px_30px_rgba(255,215,0,0.2)]">
             <div className="relative mb-4">
                {/* Crown */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-4xl md:text-5xl animate-bounce"></div>
                
                {/* Avatar */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-forge-yellow overflow-hidden shadow-[0_0_25px_rgba(255,215,0,0.5)]">
                  <img src={topThree[0].avatarUrl} alt={topThree[0].Name} className="w-full h-full object-cover" />
                </div>
                {/* Rank Badge */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-forge-yellow text-black w-10 h-10 flex items-center justify-center rounded-full font-black text-lg border-4 border-forge-dark">
                  1
                </div>
             </div>
            {/* Text Info */}
            <h3 className="font-bold text-lg md:text-xl mt-5 text-center truncate w-full">{topThree[0].Name}</h3>
            <p className="text-3xl md:text-5xl font-black text-forge-yellow my-1">{topThree[0].Total_Score}</p>
            <p className="text-gray-500 text-xs md:text-sm mb-6 pb-4">@{topThree[0].Github_Username}</p>
          </div>
        )}

        {/* === Rank 3 (Right - Bronze) === */}
        {topThree[2] && (
          <div className="flex-1 flex flex-col items-center bg-black/40 border border-stone-400/30 rounded-t-2xl md:rounded-t-3xl p-4 pb-0 backdrop-blur-sm z-10 shadow-[0_-5px_30px_rgba(87,83,78,0.5)]">
             {/* Avatar Container */}
            <div className="relative mb-3">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-stone-600 overflow-hidden shadow-[0_0_15px_rgba(87, 83, 78,0.5)]">
                <img src={topThree[2].avatarUrl} alt={topThree[2].Name} className="w-full h-full object-cover" />
              </div>
               {/* Rank Badge */}
               <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-stone-600 text-white w-8 h-8 flex items-center justify-center rounded-full font-black border-2 border-forge-dark">
                3
              </div>
            </div>
             {/* Text Info */}
            <h3 className="font-bold text-base md:text-lg mt-4 text-center truncate w-full">{topThree[2].Name}</h3>
            <p className="text-2xl md:text-3xl font-black text-stone-500 my-1">{topThree[2].Total_Score}</p>
            <p className="text-gray-500 text-xs md:text-sm mb-4 pb-4">@{topThree[2].Github_Username}</p>
          </div>
        )}

      </div>

      {/* ================= LIST SECTION (Rank 4+) ================= */}
      <div className="max-w-3xl mx-auto bg-black/30 rounded-xl border border-white/10 overflow-hidden backdrop-blur-sm">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 p-4 border-b border-white/10 text-gray-500 text-xs md:text-sm uppercase font-bold tracking-wider">
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-7">Student</div>
          <div className="col-span-3 text-right">Score</div>
        </div>

        {/* List Items */}
        {restList.length > 0 ? (
          restList.map((student) => (
            <div key={student.Github_Username || student.rank} className="grid grid-cols-12 gap-2 p-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors">
              <div className="col-span-2 text-center font-bold text-gray-400">#{student.rank}</div>
              <div className="col-span-7 flex items-center gap-3">
                <img src={student.avatarUrl} alt="avatar" className="w-10 h-10 rounded-full bg-gray-700 border border-white/10" />
                <div className="overflow-hidden">
                  <h4 className="font-bold text-white text-sm md:text-base truncate">{student.Name}</h4>
                  <p className="text-[10px] text-gray-500 truncate">@{student.Github_Username}</p>
                </div>
              </div>
              <div className="col-span-3 text-right font-bold text-forge-yellow text-lg">
                {student.Total_Score}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 font-mono">
            {students.length > 0 ? "No one else on the board yet!" : "Waiting for data..."}
          </div>
        )}
      </div>

    </div>
  );
};

export default Leaderboard;