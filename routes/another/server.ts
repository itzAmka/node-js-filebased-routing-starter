import { Request, Response } from 'express';

export const GET = (req: Request, res: Response) => {
	res.json({ message: 'GET: Hello from `/another`!' });
};

export const POST = (req: Request, res: Response) => {
	res.json({ message: 'POST: Hello from `/another`!' });
};
