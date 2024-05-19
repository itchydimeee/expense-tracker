import { usePathname } from 'next/navigation';
import Link from 'next/link';
import CreateExpenses from './createExpenses';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChartBar } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const pathname = usePathname();

  return (
    <footer className='fixed bottom-0 left-0 w-full flex justify-center items-center bg-secondary h-[70px]'>
      <nav className='flex justify-center items-center gap-4'>
        <Link href="/home" className={`px-4 py-3 rounded-xl ${pathname === '/home' ? 'bg-gray-300 text-gray-700' : 'text-gray-700'}`}>
        <FontAwesomeIcon icon={faHome} />
        </Link>
        <CreateExpenses />
        <Link href="/stats" className={`px-4 py-3 rounded-xl ${pathname === '/stats' ? 'bg-gray-300 text-gray-700' : 'text-gray-700'}`}>
        <FontAwesomeIcon icon={faChartBar} />
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;