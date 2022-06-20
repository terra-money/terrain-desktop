import React from 'react';
import Ansi from 'ansi-to-react';

function LogItemView({ log }: { log: any }) {
  return (
    <div className="text-left m-5 flex max-w-screen flex-wrap-reverse">
      <Ansi>
        {log}
      </Ansi>
    </div>
  );
}

export default React.memo(LogItemView);
