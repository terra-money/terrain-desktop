import {Link, useMatch, useResolvedPath} from "react-router-dom"
import React from "react"
function NavLink(props : {to : any, children:any}) {
    let resolved = useResolvedPath(props.to);
  let match = useMatch({ path: resolved.pathname, end: true });
    return (
        <Link {...props} className={`flex ${match ? "text-blue-100" : "text-blue-300"} space-x-1  items-center hover:text-blue-100`}></Link>
    )
}

export default React.memo(NavLink)