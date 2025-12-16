import React from 'react';

const CourseViewer = ({ data }) => {
  if (!data) {
    return (
      <div className="w-full p-10 flex justify-center">
        <div className="text-purple-400 animate-pulse text-xl font-bold">
          Sincronizando pensum (12 periodos)...
        </div>
      </div>
    );
  }

  // Ordenar las claves (periodos) numéricamente
  const sortedPeriods = Object.keys(data).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="w-full space-y-8 mt-6 pb-20">
      {sortedPeriods.map((period) => {
        const subjects = data[period];
        // Calcular total de créditos del periodo localmente
        const totalCredits = subjects.reduce((sum, sub) => sum + (sub.credits || 0), 0);

        return (
          <div key={period} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg hover:shadow-purple-900/10 transition-shadow">
            {/* Cabecera del Periodo */}
            <div className="bg-gray-700/50 px-6 py-4 border-b border-gray-600 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="bg-purple-600 text-white text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full">
                  {period}
                </span>
                <h2 className="text-lg font-bold text-gray-200">
                  Periodo {period}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                 <span className="text-xs text-gray-400 uppercase tracking-wider">
                  {subjects.length} Materias
                </span>
                <span className="text-sm font-bold text-green-400 bg-green-900/20 px-3 py-1 rounded border border-green-500/20">
                  {totalCredits} Créditos
                </span>
              </div>
            </div>

            {/* Lista de Materias */}
            <div className="p-4 grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {subjects.map((course) => (
                <div 
                  key={course.code} 
                  className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex flex-col justify-between h-full group hover:border-purple-500/30 transition-colors"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-[10px] text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded group-hover:text-purple-400 transition-colors">
                            {course.code}
                        </span>
                        <span className="text-xs font-bold text-gray-300 border border-gray-600 px-2 py-0.5 rounded">
                            {course.credits} Cr
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-100 leading-snug">
                      {course.course}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      
      <div className="text-center">
        <button 
            onClick={() => {
                localStorage.removeItem('pensum_cache_v1');
                window.location.reload();
            }}
            className="text-xs text-red-400 hover:text-red-300 underline"
        >
            Borrar caché y recargar datos
        </button>
      </div>
    </div>
  );
};

export default CourseViewer;