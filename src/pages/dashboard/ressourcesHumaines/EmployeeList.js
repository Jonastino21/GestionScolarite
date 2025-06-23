import React, { useEffect, useState } from 'react';
import EmployeeForm from './EmployeeForm';
import axios from 'axios';

const EmployeeList = ({ onStaticsticChange, statistic }) => {
  const [employees, setEmployees] = useState([]);


  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:8080/Employer/rechercher");

      onStaticsticChange({ ...statistic, employers: res.data.length })
      const loadedEmployees = res.data.map(element => ({
        id: element.id,
        name: element.nom || element.name,
        firstName: element.prenom,
        department: element.departement,
        position: element.status,
        status: element.poste,
        phone: element.telephone,
        email: element.email
      }));


      setEmployees(loadedEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Dans la fonction handleEdit, passez l'objet employee complet au lieu de juste l'ID
  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/Employer/supprimer/${id}`);
      fetchEmployees(); // Recharger les données après suppression
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };
  const handleSubmit = (employeeData) => {
    if (selectedEmployee) {
      // Mise à jour
      setEmployees(employees.map(emp =>
        emp.id === selectedEmployee.id ? { ...emp, ...employeeData } : emp
      ));
    } else {
      // Ajout
      const newEmployee = {
        name: employeeData.nom || employeeData.name,
        firstName: employeeData.prenom,
        department: employeeData.departement,
        position: employeeData.status,
        status: employeeData.poste,
        phone: employeeData.telephone,
        email: employeeData.email,
        ...employeeData,
        id: Math.max(...employees.map(emp => emp.id)) + 1
      };
      setEmployees([...employees, newEmployee]);
    }
    setShowForm(false);
    setSelectedEmployee(null);

  };


  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Liste des Employés</h2>
        <button
          onClick={() => { setSelectedEmployee(null); setShowForm(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Ajouter Employé
        </button>
      </div>

      {showForm && (
        <EmployeeForm
          employee={selectedEmployee}
          onSuccess={(data) => {
            fetchEmployees(); // Recharger la liste après succès
            setShowForm(false);
            setSelectedEmployee(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setSelectedEmployee(null);
          }}
        />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom et Prénoms </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poste</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex flex-col">
                    <div className="flex items-center">

                      <span>{employee.name}</span>
                    </div>
                    <div className="flex items-center">

                      <span>{employee.firstName}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{employee.phone}</span>
                    </div>
                    <a
                      href={`mailto:${employee.email}`}
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {employee.email}
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.position}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${employee.status === 'Actif' ? 'bg-green-100 text-green-800' :
                      employee.status === 'Congé' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                    {employee.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleEdit(employee)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
      </div>
    </div>
  );
};

export default EmployeeList;