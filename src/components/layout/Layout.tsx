import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const navigation = [
  { name: '首页', href: '/', icon: '🏠' },
  { name: '知识树', href: '/knowledge', icon: '📚' },
  { name: '错题本', href: '/mistakes', icon: '📝' },
  { name: '学习统计', href: '/statistics', icon: '📊' },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-3 sm:space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl">⚡</span>
                <h1 className="text-lg sm:text-xl font-serif font-bold text-primary">
                  代码修炼阁
                </h1>
              </Link>
              <nav className="hidden md:flex space-x-2 sm:space-x-4">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs sm:text-sm font-medium">
                  学
                </div>
                <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">学习中</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-14">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center space-y-0.5 px-3 py-1 transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-400'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="md:hidden h-16"></div>
    </div>
  );
}
