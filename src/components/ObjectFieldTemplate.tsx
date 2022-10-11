import React from 'react';

export default function ObjectFieldTemplate(props: any) {
  if (props.properties.length === 0) { return null; }
  return (
    <div className="py-6">
      <div className="text-2xl capitalize text-blue-700 font-semibold">
        {props.title}
      </div>
      {props.description}
      {props.properties.map((element: any) => (
        <div key={element.name} className="property-wrapper">
          {element.content}
        </div>
      ))}
    </div>
  );
}
