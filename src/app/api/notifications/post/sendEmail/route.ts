import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const emails = await request.json();

  // Validate the incoming email data
  if (!emails || !Array.isArray(emails)) {
    console.error("Invalid email data received:", emails);
    return NextResponse.json({ error: 'Invalid email data' }, { status: 400 });
  }

  console.log(`Received ${emails.length} emails to send.`);

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    pool: true, // Enable connection pooling for better efficiency
  });

  let sentEmails = 0;
  let failedEmails = 0;

  try {
    // Iterate over emails and send each one
    for (const email of emails) {
      console.log(`Preparing to send email to: ${email.to}`);

      if (!email.to || !email.subject || (!email.text && !email.html)) {
        console.error('Invalid email format:', email);
        failedEmails++;
        continue; // Skip invalid email data
      }

      try {
        const info = await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email.to,
          subject: email.subject,
          text: email.text || undefined,
          html: email.html || undefined,
        });

        console.log(`Email sent to: ${email.to}`);
        console.log(`Nodemailer Response:`, info.response);
        sentEmails++;
      } catch (sendError) {
        console.error(`Failed to send email to: ${email.to}`, sendError);
        failedEmails++;
      }
    }

    // Return success response with detailed information
    return NextResponse.json({
      success: true,
      message: `${sentEmails} emails sent successfully, ${failedEmails} failed.`,
      sentEmails,
      failedEmails,
    });
  } catch (error) {
    console.error('Critical error during email sending:', error);

    // Handle error safely
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
