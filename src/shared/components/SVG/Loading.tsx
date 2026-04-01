
interface PropsInterface {
    progress: number | null;
    description: string | null;
}



export default function Loading({progress, description}: PropsInterface) {
    let error;
    const errorCheck = () => {
        if (description != null && progress != null){
            error = false;
        } else {
            error = true;
        }

        return error
    }
    //mini comment
    errorCheck()

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-12 absolute bg-none text-amber-50 text-5xl">
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none" className="hds-flight-icon--animation-loading animate-spin w-32.5 h-32.5 blur-none z-10 top-20">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier"> <g fill="#5696FD" fillRule="evenodd" clipRule="evenodd"> <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z" opacity=".2"></path> 
                    <path d="M7.25.75A.75.75 0 018 0a8 8 0 018 8 .75.75 0 01-1.5 0A6.5 6.5 0 008 1.5a.75.75 0 01-.75-.75z"></path> </g> 
                </g>
            </svg>
            <p className="z-10 ">{error ? "Ошибка" : progress+"%"}</p>
            <p className="z-10 ">{error ? "Отчет не найден" : description}</p>
            
        </div>
    )
}