import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import React from 'react';

function NavLink(props: { to: any, children: any, className: string }) {
  const resolved = useResolvedPath(props.to);
  console.log('resolved', resolved);
  const match = useMatch({ path: resolved.pathname, end: true });
  console.log('props', props);
  return (
    <Link
      {...props}
      className={`${props.className} flex ${
        match ? 'selected text-blue-100' : 'text-blue-200'
      } space-x-1 items-center rounded-md mt-2`}
    />
  );
}

export default React.memo(NavLink);
