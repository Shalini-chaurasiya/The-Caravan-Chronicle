
import nodemailer from "nodemailer";

// =====================================================
// SEND CONTACT MESSAGE
// =====================================================

const sendContactMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // =================================================
        // VALIDATION
        // =================================================

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // =================================================
        // NODEMAILER
        // =================================================

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // =================================================
        // SEND EMAIL
        // =================================================

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,

            subject: `New Contact Message from ${name}`,

            html: `
                <div
                    style="
                        font-family: Arial, sans-serif;
                        padding: 20px;
                    "
                >

                    <h2>New Contact Message</h2>

                    <hr />

                    <p>
                        <strong>Name:</strong>
                        ${name}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${email}
                    </p>

                    <p>
                        <strong>Message:</strong>
                    </p>

                    <div
                        style="
                            background: #f8fafc;
                            padding: 15px;
                            border-radius: 8px;
                            white-space: pre-wrap;
                        "
                    >
                        ${message}
                    </div>

                </div>
            `,
        });

        // =================================================
        // SUCCESS RESPONSE
        // =================================================

        return res.status(200).json({
            success: true,
            message: "Message sent successfully",
        });

    } catch (error) {
        console.error(
            "Contact message error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to send message",
        });
    }
};

// =====================================================
// EXPORT
// =====================================================

export { sendContactMessage };
