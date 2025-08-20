import { NextRequest } from 'next/server'

async function sendEmail(to: string, subject: string, body: string) {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !port || !user || !pass) {
    console.log('[notify] (log only) to=%s subject=%s', to, subject)
    return { ok: false, reason: 'smtp-not-configured' }
  }

  // Lightweight dynamic import to avoid bundling when unused
  const nodemailer = await import('nodemailer')
  const transporter = nodemailer.createTransport({ host, port, auth: { user, pass } })
  await transporter.sendMail({ from: user, to, subject, text: body })
  return { ok: true }
}

export async function POST(req: NextRequest) {
  try {
    const { to, subject, body } = await req.json()
    if (!to || !subject || !body) {
      return new Response(JSON.stringify({ error: 'missing to/subject/body' }), { status: 400 })
    }

    const sent = await sendEmail(to, subject, body)
    return Response.json(sent)
  } catch {
    return new Response(JSON.stringify({ error: 'bad request' }), { status: 400 })
  }
}
