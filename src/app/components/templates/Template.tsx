'use client'
import { TemplateModel } from '@/app/models/templateModel';
import React from 'react';

interface TemplateProps {
  template: TemplateModel;
}

function Template({ template }: TemplateProps) {
  return (
    <div>
      <h2>Template Details</h2>
      <p>Description: {template.description}</p>
    </div>
  );
}

export default Template;
