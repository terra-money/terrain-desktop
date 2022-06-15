import React from 'react';
import Ansi from 'ansi-to-react';

function LogItemView({ log }: { log: any }) {
  return (
    <div className="w-full text-left flex">
      <Ansi>
        {log}
      </Ansi>
    </div>
  );
}

export default React.memo(LogItemView);
