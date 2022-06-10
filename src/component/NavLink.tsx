import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import React from 'react';

function NavLink(props : {to: any, children: any}) {
  const resolved = useResolvedPath(props.to);
  const match = useMatch({ path: resolved.pathname, end: true });
  return (
    <Link {...props} className={`flex ${match ? 'text-blue-100' : 'text-blue-300'} space-x-1  items-center hover:text-blue-100`} />
  );
}

export default React.memo(NavLink);
