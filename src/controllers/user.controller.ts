import type { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service.js';
import { AppError } from '../utils/appError.js';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.findAllUsers();
    
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.findUserById(req.params.id as string);
    
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

export const updateUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    // Only allow updating own profile
    if (req.user.id !== req.params.id) {
      return next(new AppError('You are not authorized to update this user', 403));
    }

    const updatedUser = await userService.updateUserById(req.params.id as string, req.body);
    
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    // Only allow deleting own profile
    if (req.user.id !== req.params.id) {
      return next(new AppError('You are not authorized to delete this user', 403));
    }

    await userService.deleteUserById(req.params.id as string);
    
    // Clear cookies upon deletion
    res.cookie('accessToken', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.cookie('refreshToken', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
