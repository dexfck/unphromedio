function Button({children, onClick, classText}) {
    return (
        <button onClick={onClick} className={classText}>
            {children}
        </button>
    )
}

export default Button
