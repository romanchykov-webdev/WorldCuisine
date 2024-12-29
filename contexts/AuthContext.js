import {createContext, useContext, useState} from "react";
import i18n from '../lang/i18n'; // Импортируем i18n из конфигурационного файла

const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);

    const [language, setLanguage] = useState(i18n.locale); // Храним текущий язык

    const setAuth = authUser => {
        setUser(authUser);
    }

    const setUserData = userData => {
        setUser({...userData});
    }

    // Функция для смены языка
    const changeLanguage = (newLanguage) => {
        setLanguage(newLanguage);
        i18n.locale = newLanguage; // Обновляем язык в i18n
    };

    return (
        <AuthContext.Provider value={{user, setAuth, setUserData, language, changeLanguage}}>
            {
                children
            }
        </AuthContext.Provider>
    )

}

export const useAuth = () => useContext(AuthContext);