import Link from "next/link";

export type dashNavLinksProps = {
    title: string,
    link: string
}
function DashNavLink({link,title}:dashNavLinksProps) {
    return (
        <>
               <Link href={link}>{title}</Link>
              
               
   </>
  
    )
}

export default DashNavLink
