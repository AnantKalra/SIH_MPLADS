import React from 'react'
import Navbar from './components/Navbar'
import StatCards from './components/StatCards'
import PriorityQueue from './components/PriorityQueue'
import TabBar from './components/TabBar'

function App() {
  return (
    <div className="min-h-screen bg-[#080808] pb-32">
      <Navbar />
      
      <main className="max-w-[1400px] mx-auto px-10 pt-12">
        <div className="mb-12">
          <h1 className="text-[32px] font-bold text-white mb-3 tracking-tight">Intelligence Dashboard</h1>
          <p className="text-gray-400 max-w-3xl leading-relaxed text-[15px]">
            Review and verify projects flagged by automated risk detection models. Focus on high-priority anomalies to ensure optimal resource utilization.
          </p>
        </div>

        <StatCards />
        
        <PriorityQueue />
      </main>

      <TabBar />
    </div>
  )
}

export default App
