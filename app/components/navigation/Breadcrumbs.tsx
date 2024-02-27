import { Link } from '@remix-run/react';
import { FaAngleRight } from 'react-icons/fa';

export type BreadcrumbLink = {
    path: string
    label: string
}

export default function Breadcrumbs(props: { links: BreadcrumbLink[] }) {
    const firstLinks = props.links.slice(0, props.links.length - 1)
    const lastLink = props.links.slice(-1)[0]

    return (
        <div className="text-slate-500 mb-3">
            {firstLinks.map((link, index) => {
                return (
                    <span key={index}>
                        <Link to={link.path}>{link.label}</Link>
                        <FaAngleRight className="mx-2 inline" />
                    </span>
                )
            })}
            {lastLink ? <span>{lastLink.label}</span> : ''}
        </div>
    )
};