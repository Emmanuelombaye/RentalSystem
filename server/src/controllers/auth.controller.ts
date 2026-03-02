import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { comparePassword, generateToken, hashPassword } from '../utils/auth';
import { z } from 'zod';
import crypto from 'crypto';

const prisma = new PrismaClient();

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

const activateSchema = z.object({
    token: z.string(),
    password: z.string().min(8),
});

const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

const resetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(8),
});

export const login = async (req: Request, res: Response) => {
    try {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) return res.status(400).json({ error: 'Invalid input', details: result.error.errors });

        const { email, password } = result.data;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await comparePassword(password, user.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (user.status === 'inactive') return res.status(403).json({ error: 'Account is inactive' });

        const token = generateToken({ id: user.id, email: user.email, role: user.role });
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const activateAccount = async (req: Request, res: Response) => {
    try {
        const result = activateSchema.safeParse(req.body);
        if (!result.success) return res.status(400).json({ error: 'Invalid input', details: result.error.errors });

        const { token, password } = result.data;
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true },
        });

        if (!resetToken || resetToken.expiresAt < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired activation token' });
        }

        const hashedPassword = await hashPassword(password);
        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetToken.userId },
                data: { password: hashedPassword, status: 'active' }
            }),
            prisma.passwordResetToken.delete({ where: { id: resetToken.id } }),
        ]);

        res.json({ message: 'Account activated successfully' });
    } catch (error) {
        console.error('Activation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const result = forgotPasswordSchema.safeParse(req.body);
        if (!result.success) return res.status(400).json({ error: 'Invalid input', details: result.error.errors });

        const { email } = result.data;
        const user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 1);

            await prisma.passwordResetToken.create({
                data: { token, userId: user.id, expiresAt }
            });

            // Mock email sending: logic to actually send an email would go here
            console.log(`[Email Mock] Reset Link: /activate-account?token=${token}`);
        }

        res.json({ message: 'If an account exists with this email, a reset link has been sent.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const result = resetPasswordSchema.safeParse(req.body);
        if (!result.success) return res.status(400).json({ error: 'Invalid input', details: result.error.errors });

        const { token, password } = result.data;
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true }
        });

        if (!resetToken || resetToken.expiresAt < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        const hashedPassword = await hashPassword(password);
        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetToken.userId },
                data: { password: hashedPassword }
            }),
            prisma.passwordResetToken.delete({ where: { id: resetToken.id } })
        ]);

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
