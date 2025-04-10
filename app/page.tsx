"use client";
import { useEffect, useState } from "react";

type Deal = {
  clientName: string;
  status: string;
};

type SalesRep = {
  id: number;
  name: string;
  skills: string[];
  deals: Deal[];
};

export default function Home() {
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [filteredReps, setFilteredReps] = useState<SalesRep[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [sortByDeals, setSortByDeals] = useState<boolean>(false);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch data dari backend
  useEffect(() => {
    fetch("http://localhost:8000/api/sales-reps")
      .then((res) => res.json())
      .then((data) => {
        setSalesReps(data.salesReps);
        setFilteredReps(data.salesReps);
      })
      .catch((err) => console.error("Failed to fetch:", err));
  }, []);

  // Filter dan Sortir
  useEffect(() => {
    let reps = [...salesReps];

    if (selectedSkill) {
      reps = reps.filter((rep) => rep.skills.includes(selectedSkill));
    }

    if (sortByDeals) {
      reps.sort((a, b) => b.deals.length - a.deals.length);
    }

    setFilteredReps(reps);
  }, [selectedSkill, sortByDeals, salesReps]);

  // Ambil semua skill unik
  const allSkills = Array.from(new Set(salesReps.flatMap((rep) => rep.skills)));

  // Handle pertanyaan ke AI
  const handleAskAI = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch (err) {
      console.error("Error asking AI:", err);
      setAnswer("Gagal mendapatkan jawaban dari AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 overflow-x-hidden min-h-screen max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sales Reps</h1>

      {/* Filter & Sort */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <label className="font-semibold mr-2">Filter by Skill:</label>
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All</option>
            {allSkills.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold mr-2">Sort by Deal Count:</label>
          <input
            type="checkbox"
            checked={sortByDeals}
            onChange={() => setSortByDeals(!sortByDeals)}
          />
        </div>
      </div>

      {/* AI Feature Section */}
      <div className="mt-10 p-4 border-t">
        <h2 className="text-xl font-semibold mb-2">🧠 Tanyakan ke AI</h2>
        <input
          type="text"
          placeholder="Tulis pertanyaanmu..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="border px-3 py-1 rounded w-64 mr-2"
        />
        <button
          onClick={handleAskAI}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Kirim
        </button>
        {loading && <p className="mt-2 text-gray-500">Menjawab...</p>}
        {answer && (
          <p className="mt-2 text-green-700 font-medium">💬 {answer}</p>
        )}
      </div>

      {/* Sales Rep List */}
      {filteredReps.length === 0 ? (
        <p>No sales reps found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredReps.map((rep) => (
            <li key={rep.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{rep.name}</h2>
              <p>
                <strong>Skills:</strong> {rep.skills.join(", ")}
              </p>
              <ul className="mt-2">
                {rep.deals.map((deal, i) => (
                  <li key={i}>
                    💼 {deal.clientName} — <em>{deal.status}</em>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
