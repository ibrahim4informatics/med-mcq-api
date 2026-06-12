import { createTransport, SendMailOptions, } from "nodemailer";
import ENV from "../../config/ENV";


const transporter = createTransport({

    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: ENV.MAILER_USER!,
        pass: ENV.MAILER_PASSWORD!
    }
})



export const sendEmail = async (options: SendMailOptions) => {
    const mailOptions = {
        from: ENV.MAILER_FROM!,
        ...options,
    }
    await transporter.sendMail(mailOptions);
    return true;
}