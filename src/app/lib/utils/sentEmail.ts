import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';


export async function sendEmail({ to, subject, text, html }: { to: string; subject: string; text?: string; html?: string }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    pool: true,
  });

  try {

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: text,
      html: html,
    });
    return NextResponse.json({
      success: true,
      message: `email to ${to} sent successfully!`,
    });

  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw new Error(`Could not send email to ${to}`);
  }
}