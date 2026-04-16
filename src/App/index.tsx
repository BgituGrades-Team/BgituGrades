import { useEffect, useState } from 'react'
import {getTheme} from '../shared/utils/themes'
import Header from '../Header/Header'
import RouteManager from './Routes'
import { ThemeContext } from '../shared/utils/contexts'
import { AuthContext } from '../shared/utils/contexts'




function App() {
  // const [searchParams] = useSearchParams()
  const [theme, setTheme] = useState<string>("dark")
  const [authState, /*setAuthState*/] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Получаем квери параметры йоу
  const biba = window.location.search.slice(1).split("=")
  if (biba[0] == "key") {
    sessionStorage.setItem("api_key", biba[1])
    // Получить кому принадлежит ключ и записать в authState
  }

  useEffect(() => {
    // Устанавливаем тему в body, чтобы она была доступна из любой части проекта
    document.body.setAttribute(`data-theme`, theme)
    document.body.style.backgroundColor = theme != "dark" ? "#ffffff" : "#101014"

    // Получаем тему из localStorage
    const takeTheme = getTheme();
    if (takeTheme != null){
        // Устанавливаем тему, если ее не было в localStorage
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTheme(takeTheme)
    }
  }, [theme])

  const closeModal = () => {
        setIsModalOpen(false)
  }
  const openModal = () => {
    setIsModalOpen(true)
  }
  const handleThemeChange = () => {
    if(theme == "light"){
      setTheme("dark")
    } else {
      setTheme("light")
    }
    return
  }
  
  // Проверка, есть ли ключ в query параметрах
  // const key = searchParams.get("key")
  // if (key && key != localStorage.getItem("api_key")) {
  //     localStorage.setItem("api_key", key)
  // }   


  return (
        <AuthContext value={authState}>
            <ThemeContext value={theme}>
                <Header openModal={openModal} handleThemeChange={handleThemeChange}/>
                <RouteManager closeModal={closeModal} isModalOpen={isModalOpen}/>
                
            </ThemeContext>
        </AuthContext>
    )
}

export default App
