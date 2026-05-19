// pages/NotFoundPage.jsx - 404 page
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-black text-gray-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
          <Link to="/complaints" className="btn-secondary">View Complaints</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
