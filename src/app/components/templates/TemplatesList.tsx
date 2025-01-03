'use client'
import React, { useEffect, useState } from 'react';
import { getAllTemplates } from '@/app/services/templateService';
import { TemplateModel } from '@/app/models/templateModel';

function TemplatesList() {
    const [templates, setTemplates] = useState<TemplateModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTemplates = async () => {
            const templatesData = await getAllTemplates();
            if (templatesData) {
                setTemplates(templatesData);
            }
            setLoading(false);
        };

        fetchTemplates();
    }, []);

    if (loading) {
        return <div className="text-center p-5">Loading templates...</div>;
    }

    const handleSelectTemplate = (template: TemplateModel) => {
        // פונקציה לטיפול בבחירת תבנית
        alert(`Template selected: ${template.description}`);
    };

    function formatDescription(description: string) {
        return description.split("\n").map((line, index) => (
          <p key={index}>{line}</p>
        ));
      }

    return (
        <div className="p-5">
            {templates.length === 0 ? (
                <p className="text-center text-gray-500">No templates found</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {templates.map((template) => (
                        <div
                            key={template._id}
                            className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between hover:scale-105 transition-transform duration-300"
                        >
                            <h3 className="font-semibold text-lg mb-2">{`${template.name}`}</h3>
                            <p className="text-gray-700 mb-4">{formatDescription(template.description)}</p>
                            <button
                                onClick={() => handleSelectTemplate(template)}
                                className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                            >
                                שימוש בתבנית
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TemplatesList;
