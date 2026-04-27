// import { useEffect, useState } from 'react'
// import {getTheme} from '../shared/utils/themes'
// import Header from '../Header/Header'
// import RouteManager from './Routes'
// import { ThemeContext } from '../shared/utils/contexts'
// import { AuthContext } from '../shared/utils/contexts'
// import { getKey } from '../shared/utils/apiRequests'





// function App() {
//     // const [searchParams] = useSearchParams()
//     const [theme, setTheme] = useState<string>("dark")
//     const [authState, setAuthState] = useState<string | null>("Unauthorized")
//     const [isModalOpen, setIsModalOpen] = useState(false)
//     const initializeAuth = async () => {
//         const biba = window.location.search.slice(1).split("=");
        
//         if (biba[0] === "key") {
//             sessionStorage.setItem("api_key", biba[1]);
//             const key = await getKey(biba[1]); 
            
//             if (key !== undefined) {
//                 setAuthState(key.role)
//                 sessionStorage.setItem("role", key.role);
//             }
//         }
//         const keyFromStorage = sessionStorage.getItem("api_key")
//         if (keyFromStorage) {
//             const key = await getKey(keyFromStorage); 
            
//             if (key !== undefined) {
//                 setAuthState(key.role)
//                 sessionStorage.setItem("role", key.role);
//             }
//         }
//     };

//     useEffect(() => {
//         // Устанавливаем тему в body, чтобы она была доступна из любой части проекта
//         document.body.setAttribute(`data-theme`, theme)
//         document.body.style.backgroundColor = theme != "dark" ? "#ffffff" : "#101014"

//         // Получаем тему из localStorage
//         const takeTheme = getTheme();
//         if (takeTheme != null){
//             // Устанавливаем тему, если ее не было в localStorage
//             // eslint-disable-next-line react-hooks/set-state-in-effect
//             setTheme(takeTheme)
//         }
//         initializeAuth();
//     }, [theme, authState])

//     const closeModal = () => {
//         setIsModalOpen(false)
//     }
//     const openModal = () => {
//         setIsModalOpen(true)
//     }
//     const handleThemeChange = () => {
//         if(theme == "light"){
//             setTheme("dark")
//         } else {
//             setTheme("light")
//         }
//         return
//     }
  
//     return (
//         <AuthContext value={authState}>
//             <ThemeContext value={theme}>
//                 <Header openModal={openModal} handleThemeChange={handleThemeChange}/>
//                 <RouteManager closeModal={closeModal} isModalOpen={isModalOpen}/>
                    
//             </ThemeContext>
//         </AuthContext>
//         )
//     }

// export default App



import { useEffect, useState } from 'react'
import {getTheme} from '../shared/utils/themes'
import Header from '../Header/Header'
import RouteManager from './Routes'
import { ThemeContext } from '../shared/utils/contexts'
import { AuthContext } from '../shared/utils/contexts'
import { getKey } from '../shared/utils/apiRequests'





function App() {
    const [theme, setTheme] = useState<string>("dark");
    const [authState, setAuthState] = useState<string | null>(null); // Начинаем с null (идет проверка)
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. Отдельный эффект для инициализации темы (выполняется 1 раз)
    useEffect(() => {
        const takeTheme = getTheme();
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (takeTheme) setTheme(takeTheme);
    }, []);

    // 2. Эффект для применения темы к body
    useEffect(() => {
        document.body.setAttribute(`data-theme`, theme);
        document.body.style.backgroundColor = theme !== "dark" ? "#ffffff" : "#101014";
    }, [theme]);

    // 3. Отдельный эффект для авторизации (БЕЗ зависимости от authState)
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const searchParams = new URLSearchParams(window.location.search);
                const keyFromUrl = searchParams.get("key");
                const keyFromStorage = sessionStorage.getItem("api_key");
                
                const activeKey = keyFromUrl || keyFromStorage;

                if (activeKey) {
                    if (keyFromUrl) sessionStorage.setItem("api_key", keyFromUrl);
                    
                    const keyData = await getKey(activeKey);
                    if (keyData) {
                        setAuthState(keyData.role);
                        sessionStorage.setItem("role", keyData.role);
                        return; // Успешно выходим
                    }
                }
                setAuthState("Unauthorized"); // Если ключей нет или они невалидны
            } catch (e) {
                console.log(e)
                setAuthState("Unauthorized");
            }
        };

        initializeAuth();
    }, []); // Запускаем только при монтировании

    // 4. Пока authState === null, показываем загрузку, а не "Unauthorized"
    if (authState === null) {
        return <div className="loader">Загрузка...</div>; 
    }

    return (
        <AuthContext.Provider value={authState}>
            <ThemeContext.Provider value={theme}>
                <Header openModal={() => setIsModalOpen(true)} handleThemeChange={() => setTheme(t => t === 'light' ? 'dark' : 'light')}/>
                <RouteManager closeModal={() => setIsModalOpen(false)} isModalOpen={isModalOpen}/>
            </ThemeContext.Provider>
        </AuthContext.Provider>
    );
}

export default App








