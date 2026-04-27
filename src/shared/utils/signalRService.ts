import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr"

const baseURL = import.meta.env.VITE_DOTENV_API_URL

const startSignalRConnection = async (connection: HubConnection) => {
    try {
        await connection.start()
    } catch (err) {
        console.log(err)
    }
    
}

/**
 * Функция для подключения к оценкам в сигнаое
 * @param key Секрет-ключ для подключения
 * @returns Подключение к сигналу
 */
const setupSignalRGradesConnection = async (key: string | null) => {
    const connection = new HubConnectionBuilder()
            .withUrl(baseURL + "hubs/grade?key=" + key,
                    { withCredentials: false })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.None)
            .build()

    // Если подключение срывается, мы пытаемся заново подключиться
    connection.onclose(error => {
        console.log(error)
        startSignalRConnection(connection)
    })
    await startSignalRConnection(connection)
    return connection
}    


/**
 * Функция для подключения к отчетам в сигнале
 * @param key Секрет-ключ для подключения
 * @returns Подключение к сигналу
 */
const setupSignalRReportsConnection = async (key: string | null) => {
    const connection = new HubConnectionBuilder()
            .withUrl(baseURL + "hubs/report?key=" + key,
                    { withCredentials: false })
            .withAutomaticReconnect()
            .build()

    // Если подключение срывается, мы пытаемся заново подключиться
    connection.onclose(error => {
        console.log(error)
        startSignalRConnection(connection)
    })
    await startSignalRConnection(connection)
    return connection
} 


export {
    setupSignalRGradesConnection,
    setupSignalRReportsConnection
}