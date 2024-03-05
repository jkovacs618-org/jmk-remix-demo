import { FaExclamationCircle } from 'react-icons/fa';

export default function ErrorBox({ title, children }) {
  return (
    <div
      className="flex p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
      role="alert"
    >
      <div>
        <FaExclamationCircle className="text-red-500 text-lg mr-2" />
        <span className="sr-only">{title}</span>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}
