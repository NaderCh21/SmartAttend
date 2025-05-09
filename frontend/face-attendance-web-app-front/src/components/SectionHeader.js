import React from 'react';
import '../style/SectionHeader.css';

const SectionHeader = ({ title, icon }) => (
  <div className="section-header">
    {icon}
    <h2>{title}</h2>
  </div>
);

export default SectionHeader;
