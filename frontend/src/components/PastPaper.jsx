import React from 'react'

const pastPaperYears = [2023, 2022, 2021, 2020, 2019, 2018]

const PastPapers = ({ onSelectPaper, onSelectYear }) => {
    const handleCardClick = (year) => {
        onSelectPaper(`/pastpapers/${year}.pdf`)
        onSelectYear(year.toString())
        console.log(year)
    }

    return (
        <div className='flex mt-6 p-4 h-full w-full max-w-5xl mx-auto flex-grow overflow-auto'>
            <div className='w-full max-w-5xl'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-4'>
                    {pastPaperYears.map(year => (
                        <div
                            key={year}
                            className='relative bg-white p-4 rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-shadow duration-300 group'
                            onClick={() => handleCardClick(year)}
                        >
                            <div className='absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-lg'></div>
                            <img
                                src={`/pastpapers/thumbnails/${year}.jpg`}
                                alt={`Past paper ${year}`}
                                className='w-full h-36 object-cover rounded-t-lg'
                            />
                            <div className='p-2'>
                                <h2 className='text-md text-gray-800 z-10 relative group-hover:text-white transition-colors duration-300'>
                                    G.C.E O/L English Language Past Paper <span className='text-xl font-semibold'>{year}</span>
                                </h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PastPapers
