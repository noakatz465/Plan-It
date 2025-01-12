"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddTask from "./AddTask";
import Select, { components, MultiValue, OptionProps, SingleValue, StylesConfig, GroupBase } from "react-select";
import {ListBulletIcon, CalendarDaysIcon, ViewColumnsIcon, PlusIcon, MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { useUserStore } from "@/app/stores/userStore";
import AnimatedLink from "../templates/AnimatedLink";

interface FilterOption {
  value: string;
  label: string;
}
// ממשק לאפשרויות תצוגה
interface ViewOption {
  value: string;
  label: JSX.Element;
}
const TaskNavBar: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<MultiValue<FilterOption>>([]);
  const [selectedView, setSelectedView] = useState<string | null>(null);
  const router = useRouter();
  const filterTasks = useUserStore((state) => state.filterTasks);

  const handleViewChange = (selectedOption: SingleValue<ViewOption>) => {
    if (selectedOption) {
      setSelectedView(selectedOption.value);
      router.push(`/pages/main/tasks/${selectedOption.value}`);
    }
  };
  const handleFilterChange = (
    selectedOptions: MultiValue<FilterOption> | SingleValue<FilterOption>) => {
    if (selectedOptions) {
      const filters = Array.isArray(selectedOptions) ? [...selectedOptions] : [selectedOptions];
      setSelectedFilters(filters);
      // העברת הפילטרים שנבחרו לפונקציה filterTasks
      filterTasks(filters);
    }
  };
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [openModal]);

  const searchTasks = (query: string) => {
    const filters = useUserStore.getState().currentFilters;
    filterTasks(filters, query);
  };

  const viewOptions = [
    {
      value: "list",
      label: (
        <div
          className={`flex items-center justify-center p-2 rounded-full ${selectedView === "list" ? " text-white" : "text-[#FF2929]" }`} >
          <ListBulletIcon className="h-6 w-6" />
        </div>
      ),
    },
    {
      value: "calendar",
      label: (
        <div
          className={`flex items-center justify-center p-2 rounded-full ${selectedView === "calendar" ? " text-white" : "text-[#FF2929]" }`}>
          <CalendarDaysIcon className="h-6 w-6" />
        </div>
      ),
    },
    {
      value: "kanban",
      label: (
        <div
          className={`flex items-center justify-center p-2 rounded-full ${selectedView === "kanban" ? " text-white" : "text-[#FF2929]" }`}>
          <ViewColumnsIcon className="h-6 w-6" />
        </div>
      ),
    },
  ];


  const filterOptions = [
    {
      label: "תאריך",
      options: [
        { value: "dateAsc", label: "מהישן לחדש" },
        { value: "dateDesc", label: "מהחדש לישן" },
      ],
    },
    {
      label: "עדיפות",
      options: [
        { value: "priorityLow", label: "נמוכה" },
        { value: "priorityMedium", label: "בינונית" },
        { value: "priorityHigh", label: "גבוהה" },
      ],
    },
    {
      label: "סטטוס",
      options: [
        { value: "statusPending", label: "ממתין" },
        { value: "statusInProgress", label: "בתהליך" },
        { value: "statusCompleted", label: "הושלם" },
      ],
    },
  ];

  const customViewStyles: StylesConfig<ViewOption, false, GroupBase<ViewOption>> = {
    control: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: "8px",
      padding: "0 8px",
      border: "1px solid #ccc",
      height: "44px",
      minHeight: "44px",
      boxShadow: "none",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: state.isSelected
        ? "#9694FF"
        : state.isFocused
          ? "#EBEAFF"
          : "#fff",
      color: state.isSelected ? "#fff" : "#000",
      padding: "5px 10px", // צמצום ריווח אנכי ואופקי
    }),
  };
  const customFilterStyles: StylesConfig<FilterOption, true, GroupBase<FilterOption>> = {
    control: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: "8px",
      padding: "0 8px",
      border: "1px solid #ccc",
      height: "44px",
      minHeight: "44px",
      boxShadow: "none",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      display: "flex",
      backgroundColor: state.isSelected
        ? "#9694FF"
        : state.isFocused
          ? "#EBEAFF"
          : "#fff",
      color: state.isSelected ? "#fff" : "#000",
      padding: "5px 10px", // צמצום ריווח אנכי ואופקי
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#E6E6FA",
      borderRadius: "4px",
      padding: "1px 4px", // צמצום ריווח פנימי
      margin: "2px", // מרווח קטן בין האלמנטים
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      fontSize: "12px", // גודל פונט קטן יותר
      color: "#000",
      padding: "0 2px", // צמצום ריווח פנימי בין הכיתוב לתיבה
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#FF2929",
      cursor: "pointer",
      fontSize: "12px", // גודל פונט קטן יותר גם כאן
      ":hover": {
        backgroundColor: "#FFCCCC",
      },
    }),
  };

  const CustomOption: React.FC<OptionProps<FilterOption, boolean>> = (props) => {
    const { data, isSelected } = props;
    return (
      <components.Option {...props}>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => null} // מניעת שינוי ישיר בצ'קבוקס
            className="mr-2"/>
          <span>{data.label}</span>
        </div>
      </components.Option>
    );
  };

  return (
    <div className="bg-white px-2 py-2 flex items-center justify-between  shadow-md h-12 fixed left-0 right-[50px] w-[calc(100%-50px)]  z-50 ">
      <div className="text-[#FF2929] font-bold px-2 py-1 rounded">המשימות שלי</div>
      <button
        className="text-[#FF2929] hover:text-red-700 transition duration-200 flex items-center justify-center"
        onClick={handleOpenModal}
        title="הוספת משימה">
        <PlusIcon className="h-6 w-6 stroke-[2]" />
      </button>
      <div className="mr-10" title="תבניות"> 
          <AnimatedLink />
      </div>
      {/* Search Bar */}
      <div className="flex-1 mx-4 flex justify-center">
        <div className="relative flex items-center w-full max-w-xs">
          <input
            onChange={(e) => searchTasks(e.target.value)}
            type="text"
            placeholder="חפש משימה"
            className="w-full px-3 py-1 pl-8 rounded-full bg-[#EBEAFF] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#9694FF]"/>
          <div className="absolute left-2 text-gray-500">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </div>
        </div>
      </div>
      {/* Filter Dropdown */}
      <div className="mr-2">
        <Select
          options={filterOptions}
          onChange={handleFilterChange}
          isMulti
          closeMenuOnSelect={false} // שומר על התפריט פתוח לאחר בחירה
          styles={{
            ...customFilterStyles,
            menu: (provided: Record<string, unknown>) => ({
              ...provided,
              width: "auto", // מאפשר לתפריט לגדול לפי תוכנו
              minWidth: "200px", // רוחב מינימלי לתפריט
              maxWidth: "250px", // רוחב מקסימלי לתפריט
              zIndex: 9999, // מבטיח שהדרופדאון יופיע מעל אלמנטים אחרים
              overflow: "hidden", // מונע גלילה אופקית
            }),
          }}
          placeholder="סינון"
          components={{ Option: CustomOption }}
          hideSelectedOptions={false} // שומר על האופציות הנבחרות בתפריט
          value={selectedFilters} // הערכים שנבחרו נשמרים פה
          />
      </div>
      {/* View Dropdown */}
      <div className="w-28">
        <Select
          options={viewOptions}
          onChange={handleViewChange}
          styles={customViewStyles}
          placeholder="תצוגה"/>
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg max-h-[90vh] overflow-y-auto modal-content w-full max-w-md">
            <button
              onClick={(e) => {e.stopPropagation();setOpenModal(false)}}
              className="text-red-500 float-right font-bold">
              ✖
            </button>
            <AddTask
              onClose={() => setOpenModal(false)}/>
          </div>
        </div>
      )}
    </div>
  );
};
export default TaskNavBar;
