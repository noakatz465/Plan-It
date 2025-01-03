"use client";
import React, { useEffect, useState } from "react";
import { getAllTemplates } from "@/app/services/templateService";
import { TemplateModel } from "@/app/models/templateModel";
import TemplateCard from "./TemplateCard";

function TemplatesList() {
  const [templates, setTemplates] = useState<TemplateModel[]>([]);
  const [showInfo, setShowInfo] = useState(false); // ההודעה תוצג רק אחרי שהטEMPLATES נטענו
  const [opacity, setOpacity] = useState(0); // השקיפות ההתחלתית היא 0 (נסתרת)

  useEffect(() => {
    const fetchTemplates = async () => {
      const templatesData = await getAllTemplates();
      setTemplates(templatesData || []);

      // הצגת ההודעה לאחר שהרשימה נטענה
      setTimeout(() => {
        setShowInfo(true);
        setOpacity(1); // התחלת הצגת ההודעה בהדרגה
      }, 300); // זמן קטן לאחר טעינת התבניות
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showInfo) {
      timeout = setTimeout(() => {
        setOpacity(0); // העלמת ההודעה בהדרגה
        setTimeout(() => setShowInfo(false), 1000); // הסתרת ההודעה לאחר סיום האנימציה
      }, 4000); // זמן הצגת ההודעה (4 שניות)
    }
    return () => clearTimeout(timeout);
  }, [showInfo]);

  return (
    <div className="p-5">
      {templates.length > 0 && showInfo && (
        <div
          className="text-center text-gray-600 p-2 transition-opacity duration-1000"
          style={{ opacity }}
        >
          ניתן לבחור תבנית מוכנה למשימה ולהתאים אותה לפי הצורך
        </div>
      )}
      {templates.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">...  </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {templates.map((template, index) => (
            <TemplateCard key={template._id} template={template} colorIndex={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TemplatesList;
