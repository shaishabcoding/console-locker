import { StatusCodes } from 'http-status-codes';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AdminService } from './Admin.service';

export const AdminController = {
  loginAdmin: catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const { token, admin } = await AdminService.loginAdmin(email, password);

    res.cookie('refreshToken', token.refreshToken, {
      secure: config.node_env !== 'development',
      httpOnly: true,
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Admin Login successfully!',
      data: {
        accessToken: token.accessToken,
        admin,
      },
    });
  }),

  sendOtp: catchAsync(async (req, res) => {
    const { email } = req.body;

    await AdminService.sendOtp(email);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Send Otp successfully! Check your email.',
    });
  }),

  verifyOtp: catchAsync(async (req, res) => {
    const { email, otp } = req.body;

    const { resetToken } = await AdminService.verifyOtp(email, +otp);

    res.cookie('resetToken', resetToken, {
      secure: config.node_env !== 'development',
      httpOnly: true,
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Otp verified successfully! Set your new password.',
    });
  }),

  resetPassword: catchAsync(async (req, res) => {
    const { password } = req.body;
    const { resetToken } = req.cookies;

    const { token, admin } = await AdminService.resetPassword(
      resetToken,
      password,
    );

    res.cookie('refreshToken', token.refreshToken, {
      secure: config.node_env !== 'development',
      httpOnly: true,
    });

    /** remove resetToken after reset password */
    res.clearCookie('resetToken');

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Password reset successfully!',
      data: {
        accessToken: token.accessToken,
        admin,
      },
    });
  }),
};
