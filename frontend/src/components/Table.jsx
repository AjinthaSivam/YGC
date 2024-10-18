import React from 'react'

const Table = ({headers, data}) => {
  return (
    <div>
        <table className="min-w-full table-auto bg-white border border-gray-200">
            <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    {headers.map((header, index) => (
                        <th key={index} className="py-3 px-6 text-left">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-gray-200 hover:bg-gray-100">
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="py-3 px-6">{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default Table