// components/LoadingSpinner.jsx
const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    <p className="text-gray-500 text-sm">{message}</p>
  </div>
);

export default LoadingSpinner;
