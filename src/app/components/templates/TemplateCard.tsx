'use client'
import React, { useState } from 'react';
import { TemplateModel } from '@/app/models/templateModel';
import UseTemplate from './UseTemplate';

interface TemplateCardProps {
  template: TemplateModel;
  colorIndex: number; // צבע משתנה לפי אינדקס
}

const colors = [
  "bg-gradient-to-r from-[#ff9a9e] to-[#fad0c4]",
  "bg-gradient-to-r from-[#fbc2eb] to-[#a6c1ee]",
  "bg-gradient-to-r from-[#ffecd2] to-[#fcb69f]",
  "bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb]",
  "bg-gradient-to-r from-[#d4fc79] to-[#96e6a1]",
  "bg-gradient-to-r from-[#fddb92] to-[#d1fdff]",
  "bg-gradient-to-r from-[#f6d365] to-[#fda085]",
  "bg-gradient-to-r from-[#84fab0] to-[#8fd3f4]",
  "bg-gradient-to-r from-[#fccb90] to-[#d57eeb]",
];

const TemplateCard: React.FC<TemplateCardProps> = ({ template, colorIndex }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardBackground = colors[colorIndex % colors.length];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
    <div
      className={`${cardBackground} shadow-lg rounded-lg p-6 hover:scale-[1.03] hover:shadow-xl transition-transform duration-300 ease-in-out flex flex-col justify-center items-center text-center`}
    >
      <h3 className="font-semibold text-xl text-white mb-6 drop-shadow-md">
        {template.name}
      </h3>
      <div className="mb-6">
        <p className="text-white leading-relaxed">
        </p>
      </div>
      <button
        className="mx-auto max-w-xs bg-white text-blue-600 py-2 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out hover:bg-gradient-to-r from-blue-400 to-purple-400 hover:text-white hover:shadow-lg"
        onClick={handleOpenModal}
      >
        שימוש בתבנית
      </button>

    </div>
    {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-4 rounded shadow-lg max-h-[90vh] overflow-y-auto modal-content w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="text-red-500 float-right font-bold"
            >
              ✖
            </button>
            <UseTemplate template={template} onClose={handleCloseModal} />
          </div>
        </div>
      )}</>
  );
};

export default TemplateCard;
