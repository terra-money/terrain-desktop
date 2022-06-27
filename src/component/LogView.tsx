import React from 'react';
import Ansi from 'ansi-to-react';

function LogItemView({ log }: { log: any }) {
  return <Ansi className="break-words whitespace-pre-line">{log}</Ansi>;
}

export default React.memo(LogItemView);
