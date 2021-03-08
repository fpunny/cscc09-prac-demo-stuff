import './Input.css';

// If you're interested, there's an actual npm package of this name (Which does this a little better)
// We are basically connecting all the classes together with spaces, and ignoring anything falsey
const classNames = (...cnames) => cnames.filter(Boolean).join(` `);

function Input({
    className,
    success,
    error,
    label,
    ...props
}) {
    return (
        /* If you want to be able to add classes to this element from the outside with your own styles, you need to do it like this */
        /* Since using className twice would result in the second one overwriting the last one */
        <div className={classNames(
            className,
            `input`,
        )}>
            <label
                className={classNames(
                    `input__msg--label`,
                    `input__msg`,
                )}
                htmlFor={props.name}
            >
                {label}
            </label>
            <input
                /* This is called "spreading props", where any prop passed into the component is applied to this jsx element */
                {...props}
                className={classNames(
                    success && `input__field--success`,
                    error && `input__field--error`,
                    `input__field`,
                )}
            />
            {
            typeof error === `string` || typeof success === `string`
                ? (
                    <span
                        className={classNames(
                            success && `input__msg--success`,
                            error && `input__msg--error`,
                            `input__msg--status`,
                            `input__msg`,
                        )}
                    >
                        {error || success}
                    </span>
                )
                : null
            }
        </div>
    );
}

export default Input;