export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'text-red-500 text-xs mt-1.5 ' + className}
        >
            {message}
        </p>
    ) : null;
}
