import NavSectionSkeleton from "./NavSectionSkeleton";





export default function LeftNavBarSkeleton() {
    return (
       <div className="w-31.25 h-142.5  flex flex-col items-center gap-12.5  max-sm:hidden">
            <NavSectionSkeleton />
            <NavSectionSkeleton />
            <NavSectionSkeleton />
            <NavSectionSkeleton />
       </div> 
    )
}