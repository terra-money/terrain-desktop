import React from 'react';

function LogItemView({ log }: { log: any }) {
  return <pre className="break-words whitespace-pre-line">{log}</pre>;
}

export default React.memo(LogItemView);
