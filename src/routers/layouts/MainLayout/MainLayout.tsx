import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import ReactGA from 'react-ga4';

import { Icon, useBackToTopContext } from '@/components';
import { Item } from './Item';

function MainLayout() {
  const { ref, toggleVisibility } = useBackToTopContext();
  const location = useLocation();

  useEffect(() => {
    if (!ref.current) return;

    const current = ref.current;

    current.addEventListener('scroll', toggleVisibility);

    return () => {
      current.removeEventListener('scroll', toggleVisibility);
    };
  }, [ref, toggleVisibility]);

  useEffect(() => {
    ReactGA.initialize('G-CCR1VSQL3X');
    ReactGA.send({
      hitType: 'pageview',
      page: location.pathname,
    });
    if (location.search) {
      ReactGA.event({
        category: location.pathname,
        action: location.search,
      });
    }
  }, [location]);

  const [hash, setHash] = useState(window.location.hash.replace('#/', ''));

  const navigate = useNavigate();
  const updateNav = (to: string) => {
    setHash(to);
    navigate(to);
  };

  return (
    <div className="flex h-screen max-h-screen flex-col md:max-h-full md:flex-row">
      <aside
        className={clsx(
          'flex w-screen flex-col space-y-2 md:h-screen md:w-64 md:p-4',
          'border-gray-200'
        )}
      >
        <div
          className={clsx(
            'flex justify-around md:flex-col md:space-y-2 md:p-4',
            'md:rounded-xl',
            'bg-primary text-sm text-white'
          )}
        >
          <Item
            text={'圖鑑清單'}
            color="bg-custom-red"
            selected={hash === ''}
            onClick={() => updateNav('')}
          >
            <Icon.Books className="fill-current h-5 w-5" />
          </Item>
          <Item
            text={'招式清單'}
            color="bg-custom-green"
            selected={hash === 'moves'}
            onClick={() => updateNav('moves')}
          >
            <Icon.Book className="fill-current h-5 w-5" />
          </Item>
        </div>
      </aside>
      <div
        className="h-full max-h-screen w-full overflow-y-auto md:p-4"
        ref={ref}
        style={{
          scrollbarGutter: 'stable',
        }}
      >
        <div className="mx-auto min-h-full max-w-6xl rounded-xl bg-custom-lightgrey drop-shadow-xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
