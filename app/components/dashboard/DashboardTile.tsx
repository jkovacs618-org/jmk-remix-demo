import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

function DashboardTile ({label, path, children}: {label: string; path: string; children: ReactNode;} ) {
    return (
        <Link className="tileLink text-gray-600 hover:text-sky-800" to={`${path}`}>
            <div className="dashboard-tile py-6 border border-slate-300 bg-slate-100 hover:bg-sky-50 mr-3 mb-5 w-32 text-center text-xl cursor-pointer">
                <div className="flex justify-center">
                    {children}
                </div>
                <div>{label}</div>
            </div>
        </Link>
    )
}

export default DashboardTile
