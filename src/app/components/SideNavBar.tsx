import Link from "next/link";
import React, { useState } from "react";
import {
  ClipboardDocumentListIcon,
  FolderIcon,
  ChartBarIcon,
   BookOpenIcon
} from "@heroicons/react/24/outline";

function SideNavBar() {
  const [activeLink, setActiveLink] = useState<string>("");

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  const getButtonClass = (link: string) =>
    `flex items-center justify-center p-2 w-10 h-10 rounded transition duration-200 ${activeLink === link ? "bg-[#FF2929]" : "hover:bg-[#3D3BF3]"
    }`;

  return (
    <div
      className="w-12 bg-[#9694FF] h-full flex flex-col items-center py-1 space-y-6 text-white shadow-md"
      style={{
        position: "fixed",
        width: "50px",
        marginTop: "50px", // גובה הניווט העליון
      }}
    >
      <Link href="/pages/main/tasks">
        <button
          className={getButtonClass("tasks")}
          onClick={() => handleLinkClick("tasks")}
          title="משימות"
        >
          <ClipboardDocumentListIcon className="h-7 w-7" />
        </button>
      </Link>

      <Link href="/pages/main/projects">
        <button
          className={getButtonClass("projects")}
          onClick={() => handleLinkClick("projects")}
          title="פרויקטים"
        >
          <FolderIcon className="h-7 w-7" />
        </button>
      </Link>
      {/* קו מפריד */}
      <div className="border-t border-white w-8"></div>

      <Link href="/pages/main/dashboard">
        <button
          className={getButtonClass("dashboard")}
          onClick={() => handleLinkClick("dashboard")}
          title="דשבורד"
        >
          <ChartBarIcon className="h-7 w-7" />
        </button>
      </Link>

      <Link href="/pages/main/about">
        <button
          className={getButtonClass("about")}
          onClick={() => handleLinkClick("about")}
          title="אודות"
        >
          <BookOpenIcon className="h-7 w-7" />
        </button>
      </Link>
    </div>
  );
}

export default SideNavBar;
