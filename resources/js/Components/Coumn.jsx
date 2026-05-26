import TextInput from '@/Components/TextInput';

export default function Column({ value, onChange, max, className = "px-5 py-4" }) {
    return (
        <td className={className}>
            <TextInput
                type="number" min="0" max={max}
                value={value}
                onChange={onChange}
                className="text-center !px-3 !py-2 min-w-[4.5rem] text-sm"
            />
        </td>
    );
}