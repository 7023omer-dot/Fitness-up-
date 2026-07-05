import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "לא מחובר" }, { status: 401 });
  }

  const { to, csv } = (await request.json()) as { to?: string; csv?: string };

  if (!to || !csv) {
    return NextResponse.json({ error: "חסר יעד או תוכן" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "שליחת מייל לא מוגדרת (חסר RESEND_API_KEY בסביבה)" },
      { status: 500 },
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const filename = `עסקאות-${new Date().toISOString().slice(0, 10)}.csv`;

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
    to,
    subject: "צומחים מחדש — ייצוא עסקאות",
    text: "מצורף קובץ ה-CSV של העסקאות שביקשת לייצא.",
    attachments: [
      {
        filename,
        content: Buffer.from("﻿" + csv, "utf-8").toString("base64"),
      },
    ],
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
