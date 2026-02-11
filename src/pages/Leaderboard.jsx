import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const SHEET_ID = "1EuuFzU6CCENRwWUDgAKnpLs-07TgVq8Yaazs27gmJTI";
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

        const validData = data.filter(student => student.Name && student.Name.trim() !== "");
        const sortedData = validData.sort((a, b) => b.Total_Score - a.Total_Score);
        
        const rankedData = sortedData.map((student, index) => ({
          ...student,
          rank: index + 1,
          avatarUrl: student.Github_Username 
            ? `https://github.com/${student.Github_Username}.png`
            : `https://api.dicebear.com/7.x/initials/svg?seed=${student.Name}`
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

  const topThree = [students[0], students[1], students[2]];
  const restList = students.slice(3);

  return (
    <div className="min-h-screen bg-forge-dark bg-dot-pattern text-white font-mono pt-20 pb-12 px-3 md:px-8">
      
      {/* Header Section */}
      <div className="text-center mb-10 md:mb-16">
        <h1 className="text-3xl md:text-6xl font-black tracking-tighter mb-2 md:mb-4">
          &lt;Top Performers/&gt;
        </h1>
        <p className="text-gray-400 text-xs md:text-base max-w-2xl mx-auto">
           Compete Code Conquer.
        </p>
      </div>

      {/* ================= PODIUM SECTION (Responsive) ================= */}
      {/* gap-2 on mobile, gap-8 on desktop to prevent squeezing */}
      <div className="flex justify-center items-end gap-2 md:gap-8 mb-12 max-w-3xl mx-auto">
        
        {/* === Rank 2 (Left - Silver) === */}
        {topThree[1] && (
          <div className="flex-1 flex flex-col items-center bg-black/40 border border-gray-500/30 rounded-t-xl md:rounded-t-3xl p-2 md:p-4 pb-0 backdrop-blur-sm z-10 shadow-[0_-5px_30px_rgba(192,192,192,0.2)]">
            <div className="relative mb-2 md:mb-3">
              {/* Mobile: w-14 h-14 | Desktop: w-24 h-24 */}
              <div className="w-14 h-14 md:w-24 md:h-24 rounded-full border-2 md:border-4 border-gray-300 overflow-hidden shadow-lg">
                <img src={topThree[1].avatarUrl} alt={topThree[1].Name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 md:-bottom-3 left-1/2 -translate-x-1/2 bg-gray-300 text-black w-5 h-5 md:w-8 md:h-8 flex items-center justify-center rounded-full font-black text-[10px] md:text-base border-2 border-forge-dark">
                2
              </div>
            </div>
            <h3 className="font-bold text-[10px] md:text-lg mt-3 md:mt-4 text-center truncate w-full px-1">{topThree[1].Name}</h3>
            <p className="text-lg md:text-3xl font-black text-gray-300 my-0 md:my-1">{topThree[1].Total_Score}</p>
            <p className="text-gray-500 text-[9px] md:text-sm mb-2 md:mb-4 pb-2">@{topThree[1].Github_Username}</p>
          </div>
        )}

        {/* === Rank 1 (Center - Gold - Biggest) === */}
        {topThree[0] && (
          // Mobile: -mt-8 | Desktop: -mt-12
          <div className="flex-1 flex flex-col items-center bg-black/40 border border-forge-yellow/40 rounded-t-2xl md:rounded-t-[40px] p-2 md:p-4 pb-0 backdrop-blur-sm -mt-8 md:-mt-12 z-20 shadow-[0_-5px_30px_rgba(255,215,0,0.2)]">
             <div className="relative mb-3 md:mb-4">
                <div className="absolute -top-6 md:-top-10 left-1/2 transform -translate-x-1/2 text-2xl md:text-5xl animate-bounce"></div>
                {/* Mobile: w-20 h-20 | Desktop: w-32 h-32 */}
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border-2 md:border-4 border-forge-yellow overflow-hidden shadow-lg">
                  <img src={topThree[0].avatarUrl} alt={topThree[0].Name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-3 md:-bottom-4 left-1/2 -translate-x-1/2 bg-forge-yellow text-black w-6 h-6 md:w-10 md:h-10 flex items-center justify-center rounded-full font-black text-xs md:text-lg border-2 md:border-4 border-forge-dark">
                  1
                </div>
             </div>
            <h3 className="font-bold text-xs md:text-xl mt-3 md:mt-5 text-center truncate w-full px-1">{topThree[0].Name}</h3>
            <p className="text-xl md:text-5xl font-black text-forge-yellow my-0 md:my-1">{topThree[0].Total_Score}</p>
            <p className="text-gray-500 text-[9px] md:text-sm mb-4 md:mb-6 pb-2">@{topThree[0].Github_Username}</p>
          </div>
        )}

        {/* === Rank 3 (Right - Bronze) === */}
        {topThree[2] && (
          <div className="flex-1 flex flex-col items-center bg-black/40 border border-stone-400/30 rounded-t-xl md:rounded-t-3xl p-2 md:p-4 pb-0 backdrop-blur-sm z-10 shadow-[0_-5px_30px_rgba(87,83,78,0.2)]">
            <div className="relative mb-2 md:mb-3">
              {/* Mobile: w-14 h-14 | Desktop: w-24 h-24 */}
              <div className="w-14 h-14 md:w-24 md:h-24 rounded-full border-2 md:border-4 border-stone-600 overflow-hidden shadow-lg">
                <img src={topThree[2].avatarUrl} alt={topThree[2].Name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 md:-bottom-3 left-1/2 -translate-x-1/2 bg-stone-600 text-white w-5 h-5 md:w-8 md:h-8 flex items-center justify-center rounded-full font-black text-[10px] md:text-base border-2 border-forge-dark">
                3
              </div>
            </div>
            <h3 className="font-bold text-[10px] md:text-lg mt-3 md:mt-4 text-center truncate w-full px-1">{topThree[2].Name}</h3>
            <p className="text-lg md:text-3xl font-black text-stone-500 my-0 md:my-1">{topThree[2].Total_Score}</p>
            <p className="text-gray-500 text-[9px] md:text-sm mb-2 md:mb-4 pb-2">@{topThree[2].Github_Username}</p>
          </div>
        )}
      </div>

      {/* ================= LIST SECTION (Rank 4+) ================= */}
      <div className="max-w-3xl mx-auto bg-black/30 rounded-xl border border-white/10 overflow-hidden backdrop-blur-sm">
        <div className="grid grid-cols-12 gap-1 md:gap-2 p-3 md:p-4 border-b border-white/10 text-gray-500 text-[10px] md:text-sm uppercase font-bold tracking-wider">
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-7">Student</div>
          <div className="col-span-3 text-right">Score</div>
        </div>

        {restList.length > 0 ? (
          restList.map((student) => (
            <div key={student.Github_Username || student.rank} className="grid grid-cols-12 gap-1 md:gap-2 p-3 md:p-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors">
              <div className="col-span-2 text-center font-bold text-gray-400 text-xs md:text-base">#{student.rank}</div>
              <div className="col-span-7 flex items-center gap-2 md:gap-3">
                <img src={student.avatarUrl} alt="avatar" className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-gray-700 border border-white/10" />
                <div className="overflow-hidden min-w-0">
                  <h4 className="font-bold text-white text-xs md:text-base truncate">{student.Name}</h4>
                  <p className="text-[9px] md:text-xs text-gray-500 truncate">@{student.Github_Username}</p>
                </div>
              </div>
              <div className="col-span-3 text-right font-bold text-forge-yellow text-sm md:text-lg">
                {student.Total_Score}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 font-mono text-xs md:text-base">
            {students.length > 0 ? "No one else on the board yet!" : "Waiting for data..."}
          </div>
        )}
      </div>

    </div>
  );
};

export default Leaderboard;