import 'dotenv/config';

export const port = process.env.PORT || 5000;
export const dbURI = process.env.MONGODBURL;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;