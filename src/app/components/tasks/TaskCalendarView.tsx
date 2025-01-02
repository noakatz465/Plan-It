'use client'
import React, { useEffect, useState } from 'react'
import { addDays, addMonths, addYears, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subDays, subMonths, subYears } from 'date-fns';
import { HDate } from '@hebcal/core';
import { TaskModel } from "../../models/taskModel";
import { useUserStore } from '../../stores/userStore';
import AddTask from './AddTask';
import ViewTask from './ViewTask';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, EllipsisVerticalIcon } from "@heroicons/react/24/solid";


function TaskCalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarDates, setCalendarDates] = useState<Date[]>([]);
    const [taskMap, setTaskMap] = useState<{ [key: string]: TaskModel[] }>({});
    const [view, setView] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
    const [yearlyDates, setYearlyDates] = useState<{ [key: string]: Date[] }>({});
    // const tasks = useUserStore((state) => state.tasks);
    const tasks = useUserStore((state) => state.getTasks());

    const hebrewMonths = [
        "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
        "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
    ];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewTaskModalOpen, setIsViewTaskModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTask, setSelectedTask] = useState<TaskModel | null>(null);

    const [isDayModalOpen, setIsDayModalOpen] = useState(false);
    const [selectedDayTasks, setSelectedDayTasks] = useState<TaskModel[]>([]);

    const handleOpenModal = (date: Date) => {
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const handleOpenViewTaskModal = (task: TaskModel) => {
        setSelectedTask(task);
        setIsViewTaskModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDate(null);
        setSelectedTask(null);
        setIsViewTaskModalOpen(false);
    };
    const handleOpenDayModal = (day: any, tasks: TaskModel[]) => {
        setCurrentDate(day);
        setSelectedDayTasks(tasks);
        setIsDayModalOpen(true);
    };

    const handleCloseDayModal = () => {
        setIsDayModalOpen(false);
        setSelectedDayTasks([]);
    };

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


    useEffect(() => {
        if (isDayModalOpen || isViewTaskModalOpen || isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto"; // מנקה תמיד
        };
    }, [isDayModalOpen, isViewTaskModalOpen, isModalOpen]);

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
        <div className="p-5 " dir="rtl">
            <div className="flex justify-center items-center bg-[#fff] rounded-md shadow-md w-72 mx-auto text-xs font-semibold overflow-hidden  mb-5">
                <button
                    onClick={() => handleChangeView('weekly')}
                    className={`flex-1 py-1 text-center transition duration-300 ${view === 'weekly'
                        ? 'bg-[#9694FF] text-white'
                        : 'text-[#9694FF] hover:bg-[#D6D4FF] hover:text-white'
                        }`}>
                    תצוגה שבועית
                </button>
                <button
                    onClick={() => handleChangeView('monthly')}
                    className={`flex-1 py-1 text-center transition duration-300 ${view === 'monthly'
                        ? 'bg-[#9694FF] text-white'
                        : 'text-[#9694FF] hover:bg-[#D6D4FF] hover:text-white'
                        }`}>
                    תצוגה חודשית
                </button>
                <button
                    onClick={() => handleChangeView('yearly')}
                    className={`flex-1 py-1 text-center transition duration-300 ${view === 'yearly'
                        ? 'bg-[#9694FF] text-white'
                        : 'text-[#9694FF] hover:bg-[#D6D4FF] hover:text-white'
                        }`}>
                    תצוגה שנתית
                </button>
            </div>
            <div className="flex items-center justify-center mb-5">
                {/* כפתור הקודם */}
                <button
                    onClick={() => handleDateChange("prev")}
                    className="p-2 text-gray-700 rounded-full hover:bg-white group"
                >
                    <ChevronRightIcon className="h-6 w-6 text-[#3D3BF3] group-hover:text-[#FF2929]" />
                </button>

                <h1 className="text-xl font-bold text-[#3D3BF3] mx-4">
                    {hebrewMonths[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h1>

                {/* כפתור הבא */}
                <button
                    onClick={() => handleDateChange("next")}
                    className="p-2 text-gray-700 rounded-full hover:bg-white group"
                >
                    <ChevronLeftIcon className="h-6 w-6 text-[#3D3BF3] group-hover:text-[#FF2929]" />
                </button>
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
                <div>
                    <div className="grid grid-cols-7 gap-2 border-b border-[#3D3BF3] font-bold text-[#3D3BF3] pb-2 mb-3">
                        <span className="text-[#3D3BF3] text-center">ראשון</span>
                        <span className="text-[#3D3BF3] text-center">שני</span>
                        <span className="text-[#3D3BF3] text-center">שלישי</span>
                        <span className="text-[#3D3BF3] text-center">רביעי</span>
                        <span className="text-[#3D3BF3] text-center">חמישי</span>
                        <span className="text-[#3D3BF3] text-center">שישי</span>
                        <span className="text-[#3D3BF3] text-center">שבת</span>
                    </div>
                    <div className="grid grid-cols-7 gap-2 mt-3">
                        {calendarDates.map((date) => {
                            const dateString = format(date, 'yyyy-MM-dd');
                            const dayTasks = taskMap[dateString] || [];

                            return (
                                <div
                                    onClick={() => handleOpenDayModal(date, dayTasks)}
                                    key={date.toISOString()}
                                    className={`relative p-3 text-right rounded-md ${isToday(date)
                                        ? 'bg-green-400 text-white'
                                        : format(date, 'MM') === format(currentDate, 'MM')
                                            ? 'bg-white text-gray-900'
                                            : 'bg-[#E3E1F2] text-gray-500'
                                        } ${view === 'weekly' ? 'h-60' : 'h-24' // גובה מותאם לתצוגה שבועית
                                        }`}
                                >
                                    <div className="flex justify-between items-start mt-0">
                                        <span className="text-sm font-medium">{format(date, 'd')}</span>
                                        <span className="text-sm ">{getHebrewDate(date)}</span>
                                    </div>

                                    <div className="mt-1 space-y-1 cursor-pointer">
                                        {dayTasks.length > 0 ? (
                                            <>
                                                {/* בדיקה אם מדובר בתצוגת שבועית */}
                                                {dayTasks.slice(0, view === 'weekly' ? 7 : 2).map((task, index) => (
                                                    <div
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // מונע פתיחת המודל של היום
                                                            handleOpenViewTaskModal(task);
                                                        }}
                                                        key={index}
                                                        draggable
                                                        className="flex justify-center items-center p-1 bg-[#EBEAFF] rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer h-5"
                                                    >
                                                        <span className="text-xs text-[#3D3BF3] font-medium truncate text-center">{task.title}</span>
                                                    </div>
                                                ))}

                                                {/* הצגת "..." אם יש יותר משימות מהמקסימום */}
                                                {dayTasks.length > 7 && view === 'weekly' && (
                                                    <div className="text-xl text-gray-500 text-center h-4 leading-none">
                                                        ...
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </div>


                                    {/* כפתור הוספת משימה */}
                                    <button
                                        className="absolute bottom-2 left-2 text-[#FF2929] hover:text-red-700 transition duration-200 flex items-center justify-center "
                                        onClick={(e) => {
                                            e.stopPropagation(); // למנוע פתיחת הכרטיס בעת לחיצה על הכפתור
                                            handleOpenModal(date);
                                        }}
                                        title="הוספת משימה"
                                    >
                                        <PlusIcon className="h-5 w-5 strokeWidth={6} " />
                                    </button>
                                    {/* הוספת משימה     */}
                                    {isModalOpen && (
                                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCloseModal();
                                            }}>
                                            <div className="bg-white p-4 rounded shadow-lg max-h-[90vh] overflow-y-auto modal-content w-full max-w-md"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCloseModal();
                                                    }}
                                                    className="text-red-500 float-right font-bold"> ✖</button>
                                                {selectedDate ? <AddTask dueDate={selectedDate} /> : ""}
                                            </div>
                                        </div>
                                    )}
                                    {/* תצוגת משימה */}
                                    {isViewTaskModalOpen && (
                                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCloseModal();
                                            }}
                                        >
                                            <div className="bg-white p-4 rounded shadow-lg max-h-[90vh] overflow-y-auto modal-content w-full max-w-md"
                                                onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCloseModal();
                                                    }}
                                                    className="text-red-500 float-right font-bold">✖</button>
                                                {selectedTask ?

                                                    <ViewTask task={selectedTask} />
                                                    : ""
                                                }
                                            </div>
                                        </div>
                                    )}
                                    {/* תצוגת משימות ליום נבחר */}
                                    {isDayModalOpen && (
                                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCloseDayModal();
                                            }}>
                                            <div className="bg-white p-4 rounded shadow-lg max-h-[90vh] overflow-y-auto modal-content w-full max-w-md"
                                                onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={handleCloseDayModal}
                                                    className="text-red-500 float-right font-bold"
                                                >
                                                    ✖
                                                </button>
                                                <h2 className="text-lg font-medium mb-3 text-black-900">
                                                    משימות ליום:{" "}
                                                    {currentDate ? (
                                                        <>
                                                            {format(new Date(currentDate), "dd/MM/yyyy")} |{" "}
                                                            {new HDate(new Date(currentDate)).renderGematriya()}
                                                        </>
                                                    ) : (
                                                        "תאריך לא זמין"
                                                    )}
                                                </h2>
                                                {selectedDayTasks.length > 0 ? (
                                                    <ul className="space-y-3">
                                                        {selectedDayTasks.map((task, index) => (
                                                            <li
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // מונע פתיחת המודל של היום
                                                                    handleOpenViewTaskModal(task);
                                                                }}
                                                                key={index}
                                                                className="flex items-center justify-between p-4 bg-white border-l-4 border-[#9694FF] rounded-md shadow hover:shadow-lg cursor-pointer transition duration-300 hover:border-[#FF2929] hover:bg-[#F9F9FF]"
                                                            >
                                                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#EBEAFF] text-[#3D3BF3] font-bold">
                                                                        {index + 1}
                                                                    </div>
                                                                    <span className="text-md  text-gray-700">{task.title}</span>
                                                                </div>
                                                                <div className="text-gray-500 text-xs">
                                                                    {task.description}
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-gray-500 text-center">אין משימות ליום זה.</p>
                                                )}



                                            </div>
                                        </div>
                                    )}

                                </div>

                            );
                        })}
                    </div>
                </div>
            )
            }

        </div>
    )
}

export default TaskCalendarView
