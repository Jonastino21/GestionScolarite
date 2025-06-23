import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../config';

const TimeTable = ({ data, classeId, subjects, onSave, onDelete }) => {
    const [selectedCell, setSelectedCell] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [duration, setDuration] = useState(1);
    const [actionType, setActionType] = useState('create'); // 'create' or 'edit'
    const [timeSlots, setTimeSlots] = useState({});


    // Jours et heures
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const hours = Array.from({ length: 14 }, (_, i) => 7 + i);

    // Organiser les données par jour et heure
    useEffect(() => {
        const slots = {};
        days.forEach(day => {
            slots[day] = {};
            hours.forEach(hour => {
                slots[day][hour] = null;
            });
        });

        data.forEach(course => {
            const startHour = parseInt(course.startTime.split(':')[0]);
            const endHour = parseInt(course.endTime.split(':')[0]);

            for (let hour = startHour; hour < endHour; hour++) {
                if (hours.includes(hour)) {
                    slots[course.day][hour] = {
                        ...course,
                        isFirstHour: hour === startHour,
                        duration: endHour - startHour
                    };
                }
            }
        });

        setTimeSlots(slots);
    }, [data]);

    // Gérer le clic sur une cellule
    const handleCellClick = (day, hour) => {
        const course = timeSlots[day]?.[hour];
        setSelectedCell({ day, hour });

        if (course?.isFirstHour) {
            setActionType('edit');
            setSelectedSubject(course.subjectId.toString());
            setDuration(course.duration);
        } else {
            setActionType('create');
            setSelectedSubject('');
            setDuration(1);
        }

        setShowModal(true);
    };

    // Gérer l'enregistrement
    const handleSave = () => {
        if (!selectedCell || !selectedSubject) {
            alert('Veuillez sélectionner une matière');
            return;
        }
        const course = timeSlots[selectedCell.day]?.[selectedCell.hour];

        const { day, hour } = selectedCell;
        const startHour = hour;
        const endHour = hour + duration;

        const updateData = {
            id: course?.id,
            day,
            startTime: `${startHour.toString().padStart(2, '0')}:00:00`,
            endTime: `${endHour.toString().padStart(2, '0')}:00:00`,
            subjectId: parseInt(selectedSubject)
        };

        onSave(classeId, updateData);
        setShowModal(false);
    };

    // Gérer la suppression
    const handleDelete = () => {
        if (!selectedCell) return;

        const course = timeSlots[selectedCell.day]?.[selectedCell.hour];
        if (!course) return;

        const deleteData = {
            day: course.day,
            startTime: course.startTime,
            endTime: course.endTime,
            subjectId: course.subjectId
        };

        onDelete(classeId, deleteData);
        setShowModal(false);
    };

    // Vérifier si une cellule est la première d'un cours
    const isFirstHourOfCourse = (day, hour) => {
        return timeSlots[day]?.[hour]?.isFirstHour;
    };

    // Obtenir la durée d'un cours
    const getCourseDuration = (day, hour) => {
        return timeSlots[day]?.[hour]?.duration || 1;
    };
    const getFrenchDay = (day) => {
        const daysMap = {
            MONDAY: "Lundi",
            TUESDAY: "Mardi",
            WEDNESDAY: "Mercredi",
            THURSDAY: "Jeudi",
            FRIDAY: "Vendredi",
            SATURDAY: "Samedi",
            SUNDAY: "Dimanche"
        };

        return daysMap[day] || day; // Retourne le jour en français ou la valeur originale si non trouvé
    };
    return (
        <div className="overflow-auto p-4">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border p-2 bg-gray-100">Heure/Jour</th>
                        {days.map(day => (
                            <th key={day} className="border p-2 bg-gray-100">
                            {getFrenchDay(day)}
                          </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {hours.map(hour => (
                        <tr key={hour}>
                            <td className="border p-2 bg-gray-100">{`${hour}:00`}</td>
                            {days.map(day => {
                                const course = timeSlots[day]?.[hour];
                                const isFirstHour = isFirstHourOfCourse(day, hour);
                                const rowSpan = getCourseDuration(day, hour);

                                if (!isFirstHour && course) return null;

                                return (
                                    <td
                                        key={`${day}-${hour}`}
                                        className={`border p-2 ${course ? 'bg-green-50' : 'hover:bg-gray-50 cursor-pointer'}`}
                                        onClick={() => handleCellClick(day, hour)}
                                        rowSpan={rowSpan}
                                    >
                                        {course ? (
                                            <div className="text-xs">
                                                <div className="font-semibold">{course.subjectName}</div>
                                                <div>{course.teacherName}</div>
                                                <div>{course.classLevel} {course.classDepartment}</div>
                                            </div>
                                        ) : null}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal de sélection */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">
                            {actionType === 'edit' ? 'Modifier le créneau' : 'Ajouter un créneau'}
                        </h2>

                        <div className="mb-4">
                            <label className="block mb-2">Matière:</label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="w-full border p-2 rounded"
                            >
                                <option value="">Sélectionnez une matière</option>
                                {subjects.map(subject => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2">Durée (heures):</label>
                            <select
                                value={duration}
                                onChange={(e) => setDuration(parseInt(e.target.value))}
                                className="w-full border p-2 rounded"
                            >
                                {[1, 2, 3, 4].map(num => (
                                    <option key={num} value={num}>{num} heure(s)</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-between">
                            {actionType === 'edit' && (
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Supprimer
                                </button>
                            )}

                            <div className="flex space-x-2 ml-auto">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border rounded"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    {actionType === 'edit' ? 'Modifier' : 'Ajouter'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Exemple d'utilisation
const TimeTableRender = () => {
    const { classeId } = useParams();
    const [subjects, setSubjects] = useState([])
    const [courses, setCourses] = useState([
        {
            id: 1,
            teacherId: 10,
            subjectId: 15,
            teacherName: "Prof. Dubois",
            subjectName: "Construction Intermédiaire - Module 7",
            classLevel: "L2",
            classDepartment: "BTP",
            startTime: "08:00:00",
            endTime: "11:00:00",
            day: "TUESDAY"
        }
    ]);

    useEffect(() => {
        const fetchData = async () => {

            const res = await api.get(`/timeSlot/classe/${classeId}`);
            console.log(res.config)
            console.log(res.data)
            setCourses(res.data);
            const subRes = await api.get(`/subjects/classe/${classeId}`);
            setSubjects(subRes.data);
        }
        fetchData();
    }, [])


    const handleSave = async (classeId, updates) => {
        try {
            console.log("Données à envoyer à l'API (save):", {
                endpoint: `/timeSlot/update/${classeId}`,
                data: updates
            });
            console.log(updates)

            const res = await api.patch(`/timeSlot/createOrUpdate/${classeId}`, updates);
            console.log(res.data);
            // Simulation de mise à jour
            const updatesArray = Array.isArray(updates) ? updates : [updates];

            const newCourses = courses.filter(course =>
                !updatesArray.some(update =>
                    update.day === course.day &&
                    update.startTime === course.startTime
                )
            );

            updatesArray.forEach(update => {
                const subject = subjects.find(s => s.id === update.subjectId);
                newCourses.push({
                    id: Math.max(...courses.map(c => c.id), 0) + 1,
                    teacherId: 0,
                    teacherName: "Nouveau professeur",
                    classLevel: classeId.split('-')[0],
                    classDepartment: classeId.split('-')[1],
                    ...update,
                    subjectName: subject?.name || 'Matière inconnue'
                });
            });

            setCourses(newCourses);
            alert('Modifications enregistrées avec succès!');
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'enregistrement');
        }
    };

    const handleDelete = async (classeId, deletes) => {
        try {
            console.log("Données à envoyer à l'API (delete):", {
                endpoint: `/timeSlot/delete/${classeId}`,
                data: deletes
            });
            console.log(deletes)
            const res = await api.post(`timeSlot/delete/${classeId}`, deletes)
            console.log(res.data)

            // Simulation de suppression
            const deleteArray = Array.isArray(deletes) ? deletes : Object.values(deletes);

            const newCourses = courses.filter(course =>
                !deleteArray.some(del =>
                    del.day === course.day &&
                    del.startTime === course.startTime
                )
            );


            setCourses(newCourses);
            alert('Créneau supprimé avec succès!');
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la suppression');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Emploi du temps - {classeId}</h1>
            <TimeTable
                data={courses}
                classeId={classeId}
                subjects={subjects}
                onSave={handleSave}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default TimeTableRender;