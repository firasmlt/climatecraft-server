import nodemailer from "nodemailer"
import path from "path"
import ejs from "ejs"
const connectionString =
    process.env.EMAIL_CONNECTION_STRING ||
    "smtps://USERNAME:PASSWORD@smtp.gmail.com"
const officialEmail = process.env.OFFICIAL_EMAIL || "test@test.com"

const transporter = nodemailer.createTransport(connectionString)

export async function sendConfirmationEmail(token: string, email: string) {
    try {
        const templateVariables = {
            confirmationLink: `${process.env.DOMAIN_CLIENT}/confirm?token=${token}`, // Pass variables that should be rendered in the template
        }
        console.log("templateVariables: ", templateVariables)
        const htmlContent = await renderEmailTemplate(
            `emailConfirmation`,
            templateVariables
        )
        const mailOptions = {
            from: officialEmail,
            to: email,
            subject: "Email Confirmation - Generatrix AI",
            html: htmlContent,
        }
        console.log(htmlContent)

        await transporter.sendMail(mailOptions)
    } catch (err) {
        console.log(err)
    }
}

export async function sendPasswordResetEmail(
    resetToken: string,
    email: string
) {
    try {
        const templateVariables = {
            resetLink: `${process.env.DOMAIN_CLIENT}/reset?token=${resetToken}`, // Pass variables that should be rendered in the template
        }

        console.log("templateVariables: ", templateVariables)

        const htmlContent = await renderEmailTemplate(
            `resetPassword`,
            templateVariables
        )

        const mailOptions = {
            from: officialEmail,
            to: email,
            subject: "Reset Your Password - GeneratrixAI",
            html: htmlContent,
        }

        console.log(htmlContent)

        await transporter.sendMail(mailOptions)
    } catch (err) {
        console.log(err)
    }
}

function renderEmailTemplate(
    templateName: string,
    variables: Record<string, any>
): Promise<string> {
    const templatePath = path.join(
        __dirname,
        "../emailTemplates",
        `${templateName}.ejs`
    )
    return new Promise<string>((resolve, reject) => {
        ejs.renderFile(templatePath, variables, (err: any, ejs: any) => {
            if (err) {
                reject(err)
            } else {
                resolve(ejs)
            }
        })
    })
}
