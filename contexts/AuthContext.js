import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { Appearance } from 'react-native';
import i18n from '../lang/i18n';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [requiredFields, setRequiredFields] = useState(false);
    const [previewRecipeReady, setPreviewRecipeReady] = useState(false);
    const [language, setLanguage] = useState(i18n.locale);
    const [newComments, setNewComments] = useState({});

    // console.log("AuthProvider user", user);

    const [newLikes, setNewLikes] = useState({});
    const [unreadCommentsCount, setUnreadCommentsCount] = useState(0);
    const [unreadLikesCount, setUnreadLikesCount] = useState(0);

    // Состояние для текущей темы (light, dark)
    const [currentTheme, setCurrentTheme] = useState('light');

    console.log('AuthContext rerender');

    // Мемоизация функций
    const setAuth = useCallback(authUser => {
        setUser(authUser);
        // Устанавливаем тему из данных пользователя или по умолчанию
        const userTheme = authUser?.theme || 'auto';
        updateTheme(userTheme);
    }, []);

    // const setUserData = (userData) => {
    // 	setUser((prev) => ({ ...prev, ...userData }));
    // };
    const setUserData = useCallback(userData => {
        setUser(prev => ({ ...prev, ...userData }));
    }, []);

    const changeLanguage = newLanguage => {
        setLanguage(newLanguage);
        i18n.locale = newLanguage;
    };

    // Функция для определения темы на основе настроек пользователя и устройства
    const updateTheme = useCallback(userTheme => {
        if (userTheme === 'auto') {
            // Если авто, используем тему устройства
            const deviceTheme = Appearance.getColorScheme() || 'light'; // light, dark или light по умолчанию
            setCurrentTheme(deviceTheme);
        } else {
            // Устанавливаем тему, указанную пользователем
            setCurrentTheme(userTheme);
        }
    }, []);

    // Функция для изменения темы и сохранения в Supabase
    // console.log("changeTheme currentTheme",currentTheme)
    // const changeTheme = useCallback(
    // 	async (newTheme) => {
    // 		if (!user?.id) return;
    //
    // 		try {
    // 			// Обновляем тему в Supabase
    // 			const { error } = await supabase
    // 				.from("users")
    // 				.update({ theme: newTheme })
    // 				.eq("id", user.id);
    //
    // 			if (error) {
    // 				console.error("Error updating theme:", error.message);
    // 				return;
    // 			}
    //
    // 			// Обновляем локальные данные пользователя
    // 			setUser((prev) => ({ ...prev, theme: newTheme }));
    // 			// Применяем новую тему
    // 			updateTheme(newTheme);
    // 		} catch (error) {
    // 			console.error("Unexpected error updating theme:", error);
    // 		}
    // 	},
    // 	[user, updateTheme]
    // );
    // Отслеживаем изменения темы устройства, если выбрана авто
    useEffect(() => {
        if (user?.theme === 'auto') {
            const listener = Appearance.addChangeListener(({ colorScheme }) => {
                setCurrentTheme(colorScheme || 'light');
            });
            return () => listener.remove();
        }
    }, [user?.theme]);

    // Функция для подсчёта непрочитанных уведомлений
    const fetchUnreadCount = async type => {
        if (!user?.id) return;

        try {
            const { count, error } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('is_read', false)
                .eq('type', type);

            if (error) {
                console.error(
                    `Error fetching unread ${type} count:`,
                    error.message
                );
            } else {
                if (type === 'comment') {
                    setUnreadCommentsCount(count || 0);
                } else if (type === 'like') {
                    setUnreadLikesCount(count || 0);
                }
            }
        } catch (error) {
            console.error(
                `Unexpected error fetching unread ${type} count:`,
                error
            );
        }
    };

    useEffect(() => {
        if (!user?.id) return;

        const loadInitialData = async () => {
            try {
                const { data, error } = await supabase
                    .from('notifications')
                    .select('recipe_id, type')
                    .eq('user_id', user.id)
                    .eq('is_read', false)
                    .in('type', ['comment', 'like'])
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error(
                        'Error loading initial notifications:',
                        error.message
                    );
                    return;
                }

                const comments = {};
                const likes = {};
                data.forEach(item => {
                    if (item.type === 'comment')
                        comments[item.recipe_id] = true;
                    else if (item.type === 'like') likes[item.recipe_id] = true;
                });
                setNewComments(comments);
                setNewLikes(likes);

                await Promise.all([
                    fetchUnreadCount('comment'),
                    fetchUnreadCount('like'),
                ]);
            } catch (error) {
                console.error('Unexpected error loading initial data:', error);
            }
        };

        loadInitialData();

        const subscription = supabase
            .channel(`notifications-channel-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`,
                },
                payload => {
                    const { eventType, new: newData, old: oldData } = payload;
                    const recipeId = newData?.recipe_id || oldData?.recipe_id;
                    const type = newData?.type || oldData?.type;

                    if (type === 'comment') {
                        if (
                            eventType === 'INSERT' &&
                            newData.is_read === false
                        ) {
                            setNewComments(prev => ({
                                ...prev,
                                [recipeId]: true,
                            }));
                            fetchUnreadCount('comment');
                        } else if (
                            eventType === 'UPDATE' &&
                            newData.is_read === true
                        ) {
                            setNewComments(prev => {
                                const updated = { ...prev };
                                delete updated[recipeId];
                                return updated;
                            });
                            fetchUnreadCount('comment');
                        }
                    } else if (type === 'like') {
                        if (
                            eventType === 'INSERT' ||
                            (eventType === 'UPDATE' &&
                                newData.is_read === false)
                        ) {
                            setNewLikes(prev => ({
                                ...prev,
                                [recipeId]: true,
                            }));
                            fetchUnreadCount('like');
                        } else if (
                            eventType === 'UPDATE' &&
                            newData.is_read === true
                        ) {
                            setNewLikes(prev => {
                                const updated = { ...prev };
                                delete updated[recipeId];
                                return updated;
                            });
                            fetchUnreadCount('like');
                        }
                    }
                }
            )
            .subscribe(status => console.log('Subscription status:', status));

        return () => supabase.removeChannel(subscription);
    }, [user?.id]);

    const markAsRead = async (type, recipeId, notificationId = null) => {
        if (!user?.id) return;

        try {
            let query = supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', user.id)
                .eq('type', type)
                .eq('is_read', false);

            if (notificationId) {
                query = query.eq('id', notificationId);
            } else {
                query = query.eq('recipe_id', recipeId);
            }

            const { error } = await query;
            if (error) throw error;

            await fetchUnreadCount(type);

            const { data: remaining, error: fetchError } = await supabase
                .from('notifications')
                .select('id')
                .eq('user_id', user.id)
                .eq('recipe_id', recipeId)
                .eq('type', type)
                .eq('is_read', false);

            if (fetchError) throw fetchError;

            if (type === 'comment') {
                setNewComments(prev => {
                    const updated = { ...prev };
                    if (!remaining?.length) delete updated[recipeId];
                    return updated;
                });
            } else if (type === 'like') {
                setNewLikes(prev => {
                    const updated = { ...prev };
                    if (!remaining?.length) delete updated[recipeId];
                    return updated;
                });
            }
        } catch (error) {
            console.error('Error in markAsRead:', error.message);
        }
    };
    // console.log("currentTheme",currentTheme)
    return (
        <AuthContext.Provider
            value={{
                user,
                setAuth,
                setUserData,
                language,
                changeLanguage,
                requiredFields,
                setRequiredFields,
                previewRecipeReady,
                setPreviewRecipeReady,
                newComments,
                newLikes,
                markAsRead,
                unreadCommentsCount,
                unreadLikesCount,
                currentTheme,
                setCurrentTheme,
                // changeTheme,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
