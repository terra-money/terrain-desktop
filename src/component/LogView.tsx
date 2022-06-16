import React from 'react';
import Ansi from 'ansi-to-react';

function LogItemView({ log }: { log: any }) {
  return (
    <div
      style={{
        whiteSpace: 'pre-line',
        overflowWrap: 'break-word',
      }}
    >
      <Ansi>
        {log}
      </Ansi>
    </div>
  );
}

export default React.memo(LogItemView);
