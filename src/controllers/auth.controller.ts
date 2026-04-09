import type { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, getUserById } from '../services/auth.service.js';
import { AppError } from '../utils/appError.js';
import { verifyRefreshToken, signAccessToken, signRefreshToken } from '../utils/jwt.utils.js';

// Helper to set cookie
const setTokenCookie = (res: Response, name: string, token: string, expiry: string) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const maxAge = 1000 * 60 * 60 * 24 * 7; // 7 days default
  
  res.cookie(name, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge,
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await registerUser(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, accessToken, refreshToken } = await loginUser(req.body);

    setTokenCookie(res, 'accessToken', accessToken, process.env.JWT_ACCESS_EXPIRY || '15m');
    setTokenCookie(res, 'refreshToken', refreshToken, process.env.JWT_REFRESH_EXPIRY || '7d');

    res.status(200).json({
      status: 'success',
      token: accessToken,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ('none' as const) : ('lax' as const),
    expires: new Date(Date.now() + 10 * 1000),
  };

  res.cookie('accessToken', 'loggedout', cookieOptions);
  res.cookie('refreshToken', 'loggedout', cookieOptions);

  res.status(200).json({ status: 'success' });
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return next(new AppError('No refresh token provided', 401));
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return next(new AppError('Invalid or expired refresh token', 401));
    }

    const newAccessToken = signAccessToken({ userId: decoded.userId });
    const newRefreshToken = signRefreshToken({ userId: decoded.userId });

    setTokenCookie(res, 'accessToken', newAccessToken, process.env.JWT_ACCESS_EXPIRY || '15m');
    setTokenCookie(res, 'refreshToken', newRefreshToken, process.env.JWT_REFRESH_EXPIRY || '7d');

    res.status(200).json({
      status: 'success',
      token: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await getUserById(req.user.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
