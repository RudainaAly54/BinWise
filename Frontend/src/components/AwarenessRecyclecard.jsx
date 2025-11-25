import React from 'react'
const AwarenessRecyclecard = (props) => {
    return (
        <div className="m-3 border-2 bg-white border-gray-300 rounded-xl p-5 w-full max-w-80 md:max-w-130 lg:max-w-140">
            <h2 className="font-bold text-lg mb-2">{props.title}</h2>
            <p className="text-gray-700 mb-4">{props.text}</p>

            <div className="flex flex-row justify-between gap-6">
                <div >
                    <h3 className="text-green-600 font-semibold flex items-center gap-1">
                        ♻️ Do's
                    </h3>
                    <ul className="mt-2 space-y-1 text-gray-800">
                        {props.dos.map((item, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <span>✅</span> {item}
                            </li>
                        ))}
                    </ul>
                </div>
                <div >
                    <h3 className="text-red-600 font-semibold flex items-center gap-1">
                        ⚠️ Don'ts
                    </h3>
                    <ul className="mt-2 space-y-1 text-gray-800">
                        {props.donts.map((item, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <span>❌</span> {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default AwarenessRecyclecard
