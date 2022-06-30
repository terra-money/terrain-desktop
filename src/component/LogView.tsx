import React from 'react';

const Convert = require('ansi-to-html');
const createDOMPurify = require('dompurify');

const convert = new Convert();
const DOMPurify = createDOMPurify(window);

function LogItemView({ log }: { log: any }) {
  return <pre
  className="break-words whitespace-pre-line"
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(convert.toHtml(log))
  }}/>;
}

export default React.memo(LogItemView);
