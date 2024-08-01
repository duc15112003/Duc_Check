import ChevronDownIcon from  '@heroicons/react/24/outline/ChevronDownIcon'
import {useEffect, useState} from 'react'
import { Link, useLocation } from 'react-router-dom'


function SidebarSubmenu({submenu, name, icon}){
    const location = useLocation()
    const [isExpanded, setIsExpanded] = useState(false)


    /** Open Submenu list if path found in routes, this is for directly loading submenu routes  first time */
    useEffect(() => {
        if(submenu.filter(m => {return m.path === location.pathname})[0])setIsExpanded(true)
    }, [])

    return (
         <div className='flex flex-col'>
      <div className='w-full flex justify-between items-center' onClick={() => setIsExpanded(!isExpanded)}>
        <div className='flex items-center'>
          {icon} <span className='ml-2 font-semibold'>{name}</span>
        </div>
        <ChevronDownIcon className={'w-5 h-5 transition-transform duration-500 ' + (isExpanded ? 'transform rotate-180' : '')} />
      </div>

      <div className={`w-full ${isExpanded ? "" : "hidden"}`}>
        <ul className='menu menu-compact'>
          {submenu.map((m, k) => (
            <li key={k}>
              <Link to={m.path} className='relative'>
                {m.icon} <span className='ml-2'>{m.name}</span>
                {location.pathname === m.path && (
                  <span className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary mt-1 mb-1" aria-hidden="true"></span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
    )
}

export default SidebarSubmenu