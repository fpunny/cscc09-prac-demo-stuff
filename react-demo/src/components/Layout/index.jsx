import './Layout.css';

// This is a simple layout wrapper component
// { xxx, yyy } syntax is called a "deconstructing assignment"
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
function Layout({ children }) {
    return (
        <main className='layout'>
            <div className='layout__content'>
                {/*  children is a special prop, which represents more or less whatever the Layout component wraps */}
                {children}
            </div>
        </main>
    );
}

export default Layout;