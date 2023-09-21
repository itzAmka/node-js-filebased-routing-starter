import { Request, Response } from 'express';

export const GET = (req: Request, res: Response) => {
	res.json({ message: 'Hello from /' });
};
