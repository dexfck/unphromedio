function DataCard({label, data}) {
    return (
        <div className='max-w-md w-full bg-gray-800 rounded-xl shadow-lg p-6  m-2 border border-gray-700'>
            <h1 className='text-2xl font-bold text-purple-500 mb-4'>{label}</h1>

            <div className='bg-gray-700/50 p-4 rounded-lg '>
                <h2 className='text-sm font-semibold text-gray-400 uppercase  tracking-wider mb-2'>
                    Respuesta de API:
                </h2>
                {data ? (
                    <pre className='text-xs h-[20rem]  text-green-400 overflow-auto overflow-y-visible'>
                        {JSON.stringify(data, null, 2)}
                    </pre>
                ) : (
                    <p className='text-gray-500 animate-pulse'>Cargando datos...</p>
                )}
            </div>
        </div>
    )
}

export default DataCard
