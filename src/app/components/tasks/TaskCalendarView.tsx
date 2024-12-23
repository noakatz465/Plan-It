'use client'
import React, { useEffect, useState } from 'react'
import { addDays, addMonths, addYears, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subDays, subMonths, subYears } from 'date-fns';
import { HDate } from '@hebcal/core';
import { TaskModel } from "../../models/taskModel";
import { UserModel } from '../../models/userModel';
import Link from 'next/link';
import { getUserByID } from '../../services/userService';
import { useUserStore } from '../../stores/userStore';
import AddTask from './AddTask';

function TaskCalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarDates, setCalendarDates] = useState<Date[]>([]);
    const [taskMap, setTaskMap] = useState<{ [key: string]: TaskModel[] }>({});
    const [view, setView] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
    const [yearlyDates, setYearlyDates] = useState<{ [key: string]: Date[] }>({});
    // const [user, setUser] = useState<UserModel>(new UserModel("", "", "", ""));
    const tasksFromStore = useUserStore((state) => state.tasks);
    const [tasks, setTasks]=useState<TaskModel[]>(tasksFromStore)
    // const userId = '674ed2c952ef7d7732ebb3e7';
    const hebrewMonths = [
        "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
        "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
    ];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handleOpenModal = (date: Date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDate(null);
    };

    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             const fetchedUser = await getUserByID(userId);
    //             if (fetchedUser) {
    //                 setUser(fetchedUser);
    //             } else {
    //                 console.warn("User not found");
    //             }
    //         } catch (error) {
    //             console.error("Failed to fetch user:", error);
    //         }
    //     };
    //     fetchUser();
    // }, [userId]);

    useEffect(() => {
        console.log("Updating calendar dates...");
        if (view === 'yearly') {
            setYearlyDates(createYearlyDates());
        } else {
            setCalendarDates(createCalendarDates());
        }
    }, [currentDate, view]);
    
    useEffect(() => {
        console.log("Mapping tasks...");
        if (tasks.length > 0) {
            mapTasksByDate();
        }
    }, [tasks]);
    

    const mapTasksByDate = () => {
        const newTaskMap: { [key: string]: TaskModel[] } = {};
        tasks.forEach((task) => {
            if (task.dueDate) {
                const dateString = format(new Date(task.dueDate), "yyyy-MM-dd");
                if (!newTaskMap[dateString]) {
                    newTaskMap[dateString] = [];
                }
                newTaskMap[dateString].push(task);
            }
        });
        console.log(newTaskMap + "newTaskMap");

        setTaskMap(newTaskMap);
    };

    const createCalendarDates = () => {
        let startDate, endDate;
        if (view === 'monthly') {
            startDate = startOfWeek(startOfMonth(currentDate));
            endDate = endOfWeek(endOfMonth(currentDate));
        } else if (view === 'weekly') {
            startDate = startOfWeek(currentDate);
            endDate = endOfWeek(currentDate);
        }

        const dates: Date[] = [];
        if (startDate && endDate) {
            let current = startDate;
            while (current <= endDate) {
                dates.push(current);
                current = addDays(current, 1);
            }
        }
        return dates;
    };

    const createYearlyDates = () => {
        const datesByMonth: { [key: string]: Date[] } = {};
        for (let month = 0; month < 12; month++) {
            const startOfMonthDate = startOfWeek(new Date(currentDate.getFullYear(), month, 1));
            const endOfMonthDate = endOfWeek(endOfMonth(new Date(currentDate.getFullYear(), month)));

            let current = startOfMonthDate;
            datesByMonth[month] = [];

            while (current <= endOfMonthDate) {
                datesByMonth[month].push(current);
                current = addDays(current, 1);
            }
        }
        return datesByMonth;
    };

    const handleChangeView = (newView: 'weekly' | 'monthly' | 'yearly') => {
        setView(newView);
    };

    const handleDateChange = (direction: 'next' | 'prev') => {
        if (view === 'monthly') {
            setCurrentDate((prevDate) =>
                direction === 'next' ? addMonths(prevDate, 1) : subMonths(prevDate, 1)
            );
        } else if (view === 'weekly') {
            setCurrentDate((prevDate) =>
                direction === 'next' ? addDays(prevDate, 7) : subDays(prevDate, 7)
            );
        } else if (view === 'yearly') {
            setCurrentDate((prevDate) =>
                direction === 'next' ? addYears(prevDate, 1) : subYears(prevDate, 1)
            );
        }
    };

    const handleChangeDay = (day: Date) => {
        setCurrentDate(day);
    }

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    }

    const getHebrewDate = (date: Date) => {
        const hdate = new HDate(date);
        return `${hdate.renderGematriya().substring(0, 3)} `;
    };

    return (
        <div className="p-5 font-sans" dir="rtl">
            <div className="flex justify-between items-center mb-5">
                <button onClick={() => handleDateChange('prev')}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">הקודם</button>
                <h1 className="text-xl font-bold">{hebrewMonths[currentDate.getMonth()]} {currentDate.getFullYear()}</h1>
                <button onClick={() => handleDateChange('next')}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">הבא</button>
            </div>
            <h1>{hebrewMonths[currentDate.getMonth()]}</h1>
            <div className="flex justify-center gap-4 mb-5">
                <button onClick={() => handleChangeView('weekly')} className={`px-4 py-2 rounded ${view === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>תצוגה שבועית</button>
                <button onClick={() => handleChangeView('monthly')} className={`px-4 py-2 rounded ${view === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>תצוגה חודשית</button>
                <button onClick={() => handleChangeView('yearly')} className={`px-4 py-2 rounded ${view === 'yearly' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>תצוגה שנתית</button>
            </div>
            {/* תצוגת שנתית */}
            {view === 'yearly' && (
                <div className="grid grid-cols-3 gap-4">
                    {Object.keys(yearlyDates).map((monthKey) => {
                        const monthDates = yearlyDates[monthKey];
                        const isCurrentMonth = parseInt(monthKey) === new Date().getMonth();  // בודק אם זה החודש הנוכחי
                        return (
                            <div key={monthKey} className="p-2 border rounded">
                                <h2 className="font-bold">{hebrewMonths[parseInt(monthKey)]}</h2>
                                <div className="grid grid-cols-7 gap-1">
                                    {monthDates.map((date) => {
                                        const isNextMonth = date.getMonth() === currentDate.getMonth() + 1 || (currentDate.getMonth() === 11 && date.getMonth() === 0);
                                        return (
                                            <div key={date.toISOString()} onClick={() => handleChangeDay(date)}
                                                className={`p-2 text-center cursor-pointer ${isCurrentMonth ? 'bg-gray-200 text-gray-900 ' : 'bg-gray-200 text-gray-500'} ${isNextMonth ? 'text-gray-400' : ''} ${isToday(date) ? 'bg-green-500 text-white' : ''}`}>
                                                {format(date, 'd')}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            {/* תצוגת חודש ושבוע */}
            {view !== 'yearly' && (
                <div className="grid grid-cols-7 gap-2 mt-3">
                    {calendarDates.map(date => {
                        const dateString = format(date, 'yyyy-MM-dd');
                        const dayTasks = taskMap[dateString] || [];

                        return (
                            <div
                                onClick={() => handleChangeDay(date)}
                                key={date.toISOString()} className={`p-3 text-right rounded-md ${isToday(date) ? 'bg-green-500 text-white' : format(date, 'MM') === format(currentDate, 'MM')
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'bg-gray-200 text-gray-500'
                                    }`}
                            >
                                <div className="flex justify-between">
                                    <span>{format(date, 'd')}</span>
                                    <span className="text-sm text-blue-600">{getHebrewDate(date)}</span>
                                </div>
                                <div className="mt-2">
                                    {dayTasks.length > 0 ? (
                                        dayTasks.map((task, index) => (
                                            <Link href={`/pages/viewTask/${task._id}`} key={index} draggable
                                                className="text-sm text-blue-600">
                                                {task.title}
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="text-xs text-gray-400">אין אירועים</div>

                                    )}
                                </div>
                                <button
                                    onClick={() => handleOpenModal(date)}
                                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
                                >+</button>
                                {isModalOpen && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                        <div className="bg-white p-5 rounded shadow-lg w-1/3"
                                            onClick={(e) => e.stopPropagation()}
                                        >                                            <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCloseModal();
                                            }}
                                            className="text-red-500 float-right font-bold">X</button>
                                            {selectedDate ? <AddTask dueDate={selectedDate} /> : ""}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )
            }
        </div>
    )
}

export default TaskCalendarView
