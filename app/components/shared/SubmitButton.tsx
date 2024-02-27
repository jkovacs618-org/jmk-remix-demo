
export default function SubmitButton (props: { label: string, disabled: boolean }) {
    return (
        <button
            type="submit"
            disabled={props.disabled ? true : false}
            className="rounded-md bg-sky-600 py-2 px-3 text-sm font-semibold text-white hover:text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
        >
            {props.label ? props.label : 'Submit'}
        </button>
    )
}
