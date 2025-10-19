import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    pass: process.env.EMAIL_PASS,
    user: process.env.EMAIL_USER,
  }
});

interface sendEmailProps {
  from: string,
  to: string,
  subject: string,
  text: string,
}

export const sendEmail = async (props: sendEmailProps) => {
  transporter.sendMail(props);
};