import React from 'react'
import AwarenessRecyclecard from '../components/AwarenessRecyclecard';
const AwarenessRecycle = () => {
    return (
        <div className="w-full min-h-screen overflow-x-hidden flex flex-col ">
            <div className='flex flex-wrap  justify-center '>
                <AwarenessRecyclecard title="🧴 Plastic" text="Clean containers, check recycling numbers" dos={["Clean thoroughly", "Remove caps/lids", "Check numbers 1–7"]}
                    donts={["Plastic bags", "Styrofoam", "Dirty containers"]} />
                <AwarenessRecyclecard title="📄Paper" text="Keep dry, remove contaminants" dos={["Flatten cardboard ", "Remove staples", "Keep dry"]}
                    donts={["Wet paper", "Wax-coated paper", "Tissue paper"]} />
                <AwarenessRecyclecard title="🍶Glass" text="Rinse clean, separate by color" dos={["Rinse containers ", "Remove metal lids", "Separate colors"]}
                    donts={["Broken glass", "Light bulbs", "Mirrors"]} />
                <AwarenessRecyclecard title="🥫Metal" text="Clean cans, separate types" dos={["Clean food residue ", "Crush to save space", "Include steel cans"]}
                    donts={["Paint cans", "Aerosol cans", "Hazardous materials"]} />
            </div>
        </div>
        
    )
    
}
export default AwarenessRecycle;
