import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, isError = false, isTextarea = false, rows = 3, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const commonClasses = `w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:border-transparent transition-all ` +
        (isError 
            ? 'border-red-300 bg-red-50 focus:ring-red-500 text-red-900 ' 
            : 'border-slate-200 bg-slate-50 focus:ring-indigo-500 text-slate-800 ') +
        className;

    if (isTextarea) {
        return (
            <textarea
                {...props}
                rows={rows}
                className={commonClasses}
                ref={localRef}
            />
        );
    }

    return (
        <input
            {...props}
            type={type}
            className={commonClasses}
            ref={localRef}
        />
    );
});
