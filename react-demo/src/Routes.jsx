import { Switch, Route } from "react-router";
import { Suspense, lazy, useEffect, useState, createContext } from "react";

const routes = [
    {
        component: lazy(() => import('./pages/Thicc/index.jsx')),
        path: '/thicc',
        exact: true,
    },
    {
        component: lazy(() => import('./App.jsx')),
        path: '/',
        exact: true,
    },
    {
        component: lazy(() => import('./pages/404/index.jsx')),
    },
];

export const DMContext = createContext({});

function Routes() {
    const [ isDarkMode, setIsDM ] = useState(false);
    useEffect(() => {
        const cl = document.body.classList;
        if (isDarkMode) {
            cl.add('darknow');
        } else {
            cl.remove('darknow');
        }
    }, [ isDarkMode ]);

    return (
        <DMContext.Provider value={{ isDarkMode, setIsDM }}>
            <Suspense fallback={`Loading...`}>
                <Switch>
                    {routes.map((routeProps, index) => (
                        <Route {...routeProps} key={index}/>
                    ))}
                </Switch>
            </Suspense>
        </DMContext.Provider>
    );
}

export default Routes;