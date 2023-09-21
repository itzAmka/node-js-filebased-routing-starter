import { Express } from 'express';
import path from 'path';
import { glob } from 'glob';

export const enableFilebasedRouting = async (app: Express) => {
	// get all the routes: NOTE: .js files are not included
	const routes = glob.sync('./routes/**/*.ts');

	// loop through all the routes
	for (const route of routes) {
		const routeHandler = await import(
			new URL(`file:${path.resolve('./dist', route)}`).href.replace(
				'.ts',
				'.js',
			) // replace .ts with .js, so that when we import it, it will import the .js file
		);

		const routePath = route
			.replaceAll('\\', '/') // replace all backslashes with forward slashes
			.replaceAll('routes', '') // remove routes from the path
			.replaceAll('/server.ts', ''); // remove server.ts from the path

		// loop through all the methods in the routeHandler
		Object.keys(routeHandler).forEach(method => {
			// allowed methods
			const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'];

			// accepted methods are(only GET, POST, PUT, DELETE, PATCH, HEAD));
			if (!allowedMethods.includes(method.toUpperCase())) {
				throw new Error(`Invalid method: \`${method}\` for \`${routePath}\``, {
					cause: `Only GET, POST, PUT, DELETE, PATCH are allowed: and you provided \`${method}\``,
				});
			}

			// check if routeHandler[method] is a function
			if (typeof routeHandler[method] !== 'function') {
				throw new Error(
					`Route handler for \`${method}\` \`${route}\` is not a function`,
					{
						cause: `Route handler must be a function. Please provide a function`,
					},
				);
			}

			// NOTE: I called one by one, because app[method] can have more the `allowedMethods`
			// for get requests
			if (method.toUpperCase() === 'GET') {
				app.get(routePath, routeHandler[method]);
			}

			// for post requests
			if (method.toUpperCase() === 'POST') {
				app.post(routePath, routeHandler[method]);
			}

			// for put requests
			if (method.toUpperCase() === 'PUT') {
				app.put(routePath, routeHandler[method]);
			}

			// for delete requests
			if (method.toUpperCase() === 'DELETE') {
				app.delete(routePath, routeHandler[method]);
			}

			// for patch requests
			if (method.toUpperCase() === 'PATCH') {
				app.patch(routePath, routeHandler[method]);
			}

			// for head requests
			if (method.toUpperCase() === 'HEAD') {
				app.head(routePath, routeHandler[method]);
			}
		});
	}
};
