import React, { useState } from 'react';
import EmployeeList from '../ressourcesHumaines/EmployeeList';
import DepartmentList from '../ressourcesHumaines/DepartmentList';
import RhStats from '../ressourcesHumaines/RhStats'
import AttendanceChart from './AttendanceChart';

const RhDashboard = () => {
  const [statistics, setStatistics] = useState({employers :50})
  const [departmentStat,setDepartementStat] = useState(30)
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestion des Ressources Humaines</h1>
      
         {/* Statistiques */}
         <RhStats employers={statistics.employers} department={departmentStat}/>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Liste des employés */}
        <div className="lg:col-span-2">
          <EmployeeList onStaticsticChange={setStatistics} statistic={statistics}/>
        </div>
        
        {/* Liste des départements */}
        <div>
          <DepartmentList onStaticsDep={setDepartementStat} statDep={departmentStat}/>
        </div>
      </div>
    
    </div>
  );
};

export default RhDashboard;