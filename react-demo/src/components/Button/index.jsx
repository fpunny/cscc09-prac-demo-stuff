import './Button.css';

const classNames = (...cnames) => cnames.filter(Boolean).join(` `);

function Button({
    className,
    children,
    loading,
    ...props
}) {
    return (
        <button
            {...props}
            className={classNames(
                className,
                `button`,
            )}
        >
            {loading ? `Loading...` : children}
        </button>
    );
}

export default Button;