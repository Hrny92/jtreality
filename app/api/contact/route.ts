import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json() as {
      name: string; email: string; phone: string; message: string
    }

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Vyplňte všechna povinná pole.' }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      host:   process.env.EMAIL_SMTP_HOST ?? 'smtp.seznam.cz',
      port:   Number(process.env.EMAIL_SMTP_PORT ?? 465),
      secure: true, // SSL na portu 465
      auth: {
        user: process.env.EMAIL_SMTP_USER,
        pass: process.env.EMAIL_SMTP_PASS,
      },
    })

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; color: #1a1a1a;">
        <div style="background: #080808; padding: 24px 32px; margin-bottom: 0;">
          <span style="color: #f9b233; font-size: 12px; letter-spacing: 0.3em; text-transform: uppercase;">JT Reality</span>
          <h2 style="color: #ffffff; margin: 8px 0 0; font-size: 20px;">Nová zpráva z webu</h2>
        </div>
        <div style="background: #f7f7f7; padding: 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666; font-size: 13px; width: 120px;">Jméno</td>
                <td style="padding: 8px 0; font-size: 14px; font-weight: 600;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">E-mail</td>
                <td style="padding: 8px 0; font-size: 14px;">
                  <a href="mailto:${email}" style="color: #f9b233;">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Telefon</td>
                <td style="padding: 8px 0; font-size: 14px;">${phone || '—'}</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.15em;">Zpráva</p>
          <p style="font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
        </div>
        <div style="background: #080808; padding: 16px 32px; text-align: center;">
          <span style="color: #555; font-size: 11px;">www.jtreality.cz · info@jtreality.cz · +420 704 011 022</span>
        </div>
      </div>
    `

    await transporter.sendMail({
      from:    `"JT Reality Web" <${process.env.EMAIL_SMTP_USER}>`,
      to:      process.env.EMAIL_TO ?? 'info@jtreality.cz',
      replyTo: email,
      subject: `Nová zpráva z webu — ${name}`,
      text:    `Jméno: ${name}\nE-mail: ${email}\nTelefon: ${phone || '—'}\n\nZpráva:\n${message}`,
      html,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Nepodařilo se odeslat zprávu. Zkuste to prosím znovu.' }, { status: 500 })
  }
}
