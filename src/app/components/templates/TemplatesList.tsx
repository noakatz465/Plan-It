import React, { useEffect, useState } from 'react';
import Template from './Template';
import { getAllTemplates } from '@/app/services/templateService';
import { TemplateModel } from '@/app/models/templateModel';

function TemplatesList() {
  const [templates, setTemplates] = useState<TemplateModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      const templatesData = await getAllTemplates();
      setTemplates(templatesData);
      setLoading(false);
    };

    fetchTemplates();
  }, []);

  if (loading) {
    return <div>Loading templates...</div>;
  }

  return (
    <div>
      <h2>Templates List</h2>
      {templates.length === 0 ? (
        <p>No templates found</p>
      ) : (
        <ul>
          {templates.map((template, index) => (
            <li key={index}>
              <Template template={template} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TemplatesList;
