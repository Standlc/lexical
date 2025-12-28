import { useSavedWordsCrossTabSync } from '@/lib/savedWordsQuery';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

const RootLayout = () => {
	useSavedWordsCrossTabSync();

	return (
		<>
			{/* <div className="p-2 flex gap-2">
				<Link to="/" className="[&.active]:font-bold">
					Home
				</Link>{' '}
			</div> */}
			<Outlet />
			<TanStackRouterDevtools />
		</>
	);
};

export const Route = createRootRoute({ component: RootLayout });
