import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMovieAddedEmail(email: string, movieName: string, movieLink: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Cinemax <onboarding@resend.dev>',
      to: email,
      subject: `Your requested movie ${movieName} is now available!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h1 style="color: #e50914;">Cinemax</h1>
          <p>Hi there,</p>
          <p>We are happy to inform you that the movie you recommended, <strong>${movieName}</strong>, has been added to our collection.</p>
          <p>You can download it now by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${movieLink}" 
               style="background-color: #e50914; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Download Now
            </a>
          </div>
          <p>Thank you for your recommendation!</p>
          <p>Best regards,<br>The Cinemax Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Exception sending email:', error);
    return { success: false, error };
  }
}
