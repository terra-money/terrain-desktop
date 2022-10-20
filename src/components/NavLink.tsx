import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import React from 'react';

const NavLink = (props: { to: any, children: any, className: string }) => {
  const resolved = useResolvedPath(props.to);
  const match = useMatch({ path: resolved.pathname, end: true });
  return (
    <Link
      {...props}
      className={`${props.className} flex ${
        match
          ? 'selected text-white bg-terra-button-primary fill-white'
          : 'text-terra-text-grey fill-terra-text-grey hover:bg-[#0f40b9] hover:text-white hover:fill-white'
      } space-x-1 items-center rounded mt-2`}
    />
  );
};

export default React.memo(NavLink);
