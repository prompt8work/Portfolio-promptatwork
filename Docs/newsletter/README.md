# Newsletter operations

Made 2026-10-21. The subscriber list lives in a Zoho Sheet. Newsletter content is written in Sanity, like all site content. Emails use the same branded layout as the contact emails (`src/lib/email/layout.ts`).

## The sheet

Import `PromptAtWork-Newsletter-Operations.xlsx` into the Zoho Sheet. It has five tabs:

| Tab | Who writes it | Purpose |
|---|---|---|
| Read me | — | Rules for the sheet |
| Subscribers | Website + you | One row per email: Status, Consent, Interests, Source, dates, unsubscribe token |
| Issues | You | One row per newsletter: subject, audience, planned date, status |
| Send Log | Website | One row per email sent: issue, address, result, error |
| Lists | — | Dropdown values (Status, Interest, Source, …) |

Who receives a newsletter: only rows where Status = Subscribed **and** Consent = Yes. Unsubscribed rows are never deleted.

## Flow

```
Website signup form ──► Subscribers (Status: Subscribed, token)
Newsletter issue in Sanity ──► "Send" (admin) ──► reads Subscribers ──► sends in small batches ──► Send Log
Unsubscribe link in each email ──► website ──► Status: Unsubscribed
```

## Where settings live

| Setting | Where | Why |
|---|---|---|
| Zoho API client ID, client secret, refresh token | Vercel environment variables | Secrets that rarely change |
| Sheet ID (`jdzjje8dc77c52a794ea3b106672b5716761a`) and tab names | **Vercel Edge Config** (`newsletter.sheetId`) | Change it in the Vercel dashboard and it applies within seconds, with no redeploy. A Vercel environment variable would need a redeploy (no code change, but a rebuild) |
| SMTP (Zoho Mail) | Vercel environment variables | Already set up for the contact emails |

## Access needed from you (when you're ready)

The site reads and writes the sheet through the Zoho Sheet API, which needs a one-time permission:

1. Open **api-console.zoho.in** → *Add Client* → **Self Client**.
2. Copy the **Client ID** and **Client Secret** into `.env.local` as `ZOHO_CLIENT_ID` and `ZOHO_CLIENT_SECRET`. Don't paste them into chat.
3. Under *Generate Code*, enter the scope `ZohoSheet.dataAPI.READ,ZohoSheet.dataAPI.UPDATE`, set the duration to 10 minutes, and generate.
4. Send Claude that one-time code. It is exchanged for a long-lasting refresh token and saved as `ZOHO_REFRESH_TOKEN`. Then add the same three settings in Vercel.

Also: create an Edge Config store in Vercel (Storage → Edge Config) and connect it to the project.

## Rules

- Every newsletter has a working unsubscribe link, and unsubscribing takes effect immediately.
- Imported contacts get Consent = Yes only if they agreed to receive emails.
- Content comes from real work only (`Docs/design/content-guidelines.md`).
