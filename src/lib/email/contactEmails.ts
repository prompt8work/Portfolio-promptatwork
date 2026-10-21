import nodemailer from "nodemailer";
import { getSiteSettings, getWorkshops } from "../content";
import { absoluteUrl, button, cards, emailColors, emailLayout, escapeHtml, linkCard, sectionTitle } from "./layout";
import type { ContactMessageInput } from "../../supabase/contactRepository";

// Contact-form emails, sent through the Zoho mailbox over SMTP. One address
// both sends and receives: the notification goes to the mailbox itself with
// Reply-To set to the visitor, and the confirmation goes to the visitor.
// Unset SMTP_* variables switch emails off (the message is still saved).

const REPLY_TIME = "1 working day";

// Best-effort per-sender limit on visitor confirmations, so the form can't
// be used to make the mailbox send mail to an address over and over. It
// lives in memory, so it resets per server instance; the honeypot in the
// form action catches most bots before this is reached.
const CONFIRM_WINDOW_MS = 60 * 60 * 1000;
const CONFIRM_MAX = 2;
const recentConfirmations = new Map<string, number[]>();

function allowConfirmation(email: string): boolean {
  const now = Date.now();
  const key = email.toLowerCase();
  const recent = (recentConfirmations.get(key) ?? []).filter((t) => now - t < CONFIRM_WINDOW_MS);
  if (recent.length >= CONFIRM_MAX) return false;
  recent.push(now);
  recentConfirmations.set(key, recent);
  return true;
}

function transport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_USER || !SMTP_PASS) return null;
  const port = Number(SMTP_PORT || 465);
  return nodemailer.createTransport({
    host: SMTP_HOST || "smtp.zoho.in",
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

// Header values come from the visitor; strip line breaks so they can't add headers.
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

const paragraphs = (text: string) =>
  text
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 12px">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("");

const firstSentence = (text: string) => (text.match(/^.*?[.!?](\s|$)/)?.[0] ?? text).trim();

export async function sendContactEmails(input: ContactMessageInput): Promise<void> {
  const mailer = transport();
  if (!mailer) {
    console.warn("Contact emails skipped: SMTP_USER / SMTP_PASS not set");
    return;
  }

  const [settings, workshops] = await Promise.all([getSiteSettings(), getWorkshops()]);
  const mailbox = process.env.SMTP_USER!;
  const notifyTo = process.env.CONTACT_NOTIFY_TO || mailbox;
  const from = `"${settings.brandName}" <${mailbox}>`;
  const name = oneLine(input.name);
  const firstName = name.split(" ")[0] || name;
  const received = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date());
  const organization = input.organization || "Not given";

  const notification = mailer.sendMail({
    from,
    to: notifyTo,
    replyTo: { name, address: input.email },
    subject: `New enquiry: ${input.purpose} from ${name}`,
    text: [
      `New message from the ${settings.brandName} contact form.`,
      "",
      `Name:          ${name}`,
      `Email:         ${input.email}`,
      `Organization:  ${organization}`,
      `Purpose:       ${input.purpose}`,
      `Received:      ${received} IST`,
      "",
      "Message:",
      input.message,
      "",
      `Reply to this email to answer ${name} directly.`,
    ].join("\n"),
    html: emailLayout({
      settings,
      preheader: `${input.purpose} enquiry from ${name}`,
      body:
        `<p style="margin:0 0 4px;font-size:20px;font-weight:700">New enquiry: ${escapeHtml(input.purpose)}</p>` +
        `<p style="margin:0 0 18px;color:${emailColors.muted}">From the ${escapeHtml(settings.brandName)} contact form, ${received} IST.</p>` +
        `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 18px">` +
        [
          ["Name", name],
          ["Email", input.email],
          ["Organization", organization],
          ["Purpose", input.purpose],
        ]
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 18px 4px 0;color:${emailColors.muted}">${k}</td><td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`,
          )
          .join("") +
        `</table>` +
        `<div style="border-left:3px solid ${emailColors.accent};background:${emailColors.page};border-radius:0 10px 10px 0;padding:14px 16px 4px;margin:0 0 18px">${paragraphs(input.message)}</div>` +
        `<p style="margin:0;color:${emailColors.muted}">Reply to this email to answer ${escapeHtml(name)} directly. Promised reply time: ${REPLY_TIME}.</p>`,
    }),
  });

  // The confirmation never repeats the visitor's message, so the form
  // can't be used to deliver someone else's text from this mailbox. It
  // does point to the site's courses, services and work.
  const featured = workshops.slice(0, 3);
  const confirmation = allowConfirmation(input.email)
    ? mailer.sendMail({
        from,
        to: { name, address: input.email },
        replyTo: mailbox,
        subject: `Thanks for getting in touch, ${settings.brandName}`,
        text: [
          `Hi ${firstName},`,
          "",
          `Thanks for your message about ${input.purpose}. It has reached me, and I'll reply within ${REPLY_TIME}.`,
          "If you have anything to add, just reply to this email.",
          "",
          "While you wait:",
          `- Courses and workshops: ${absoluteUrl("/training")}`,
          ...featured.map((w) => `  * ${w.title}: ${absoluteUrl(`/training/${w.slug}`)}`),
          `- AI Lab, the projects I've built: ${absoluteUrl("/ai-lab")}`,
          `- Blog: ${absoluteUrl("/blog")}`,
          "",
          settings.personName,
          `${settings.brandName} · ${absoluteUrl("/")}`,
        ].join("\n"),
        html: emailLayout({
          settings,
          preheader: `I'll reply within ${REPLY_TIME}. Meanwhile, here's what you can explore.`,
          body:
            `<p style="margin:0 0 6px;font-size:22px;font-weight:700">Thanks, ${escapeHtml(firstName)}. Your message is in.</p>` +
            `<p style="margin:0 0 14px">I've received your message about <strong>${escapeHtml(input.purpose)}</strong> and will reply within <strong>${REPLY_TIME}</strong>. If you have anything to add, just reply to this email.</p>` +
            (featured.length
              ? sectionTitle("Courses & workshops") +
                cards(featured.map((w) => linkCard(w.title, firstSentence(w.description), absoluteUrl(`/training/${w.slug}`)))) +
                `<p style="margin:4px 0 0">${button("See all courses", absoluteUrl("/training"))}</p>`
              : "") +
            (settings.services?.length
              ? sectionTitle("What I offer") +
                `<p style="margin:0">${settings.services
                  .map(
                    (svc) =>
                      `<span style="display:inline-block;margin:0 6px 8px 0;padding:6px 12px;border-radius:999px;background:${emailColors.page};border:1px solid ${emailColors.line};font-size:13px;color:${emailColors.ink}">${escapeHtml(svc)}</span>`,
                  )
                  .join("")}</p>`
              : "") +
            sectionTitle("See the work") +
            `<p style="margin:0 0 14px;color:${emailColors.muted}">Case studies, tools, prompts and automations I've built and documented in the AI Lab.</p>` +
            `<p style="margin:0">${button("Explore the AI Lab", absoluteUrl("/ai-lab"), "outline")}</p>` +
            `<p style="margin:28px 0 0">${escapeHtml(settings.personName)}<br><span style="color:${emailColors.muted}">${escapeHtml(settings.jobTitle ?? "")}</span></p>`,
        }),
      })
    : Promise.resolve();

  const results = await Promise.allSettled([notification, confirmation]);
  for (const r of results) {
    if (r.status === "rejected") console.error("Contact email failed:", r.reason);
  }
}
