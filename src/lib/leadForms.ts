import { supabase } from "@/integrations/supabase/client";

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const validateEmail = (value: string) => EMAIL_REGEX.test(value.trim());

export const normaliseFormData = (fields: Record<string, string>) =>
  Object.entries(fields).reduce<Record<string, string>>((acc, [key, value]) => {
    acc[key] = value.trim();
    return acc;
  }, {});

interface BuildEmailPayloadInput {
  formType: string;
  fields: Record<string, string>;
  honeypot?: string;
  destination?: string;
  replyTo?: string;
}

export const buildEmailPayload = ({
  formType,
  fields,
  honeypot = "",
  destination,
  replyTo,
}: BuildEmailPayloadInput) => ({
  formType,
  fields: normaliseFormData(fields),
  honeypot,
  destination,
  replyTo,
});

export const sendTransactionalEmail = async (
  payload: ReturnType<typeof buildEmailPayload>,
) => {
  const { data, error } = await supabase.functions.invoke("send-lead-form", {
    body: payload,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  if (!data?.success) {
    return { ok: false, error: data?.error ?? "Unable to send email" };
  }

  return { ok: true };
};

export const submitLeadForm = async ({
  formType,
  fields,
  honeypot = "",
  destination,
  replyTo,
}: BuildEmailPayloadInput) => {
  if (honeypot.trim().length > 0) {
    return { ok: true, spamBlocked: true };
  }

  const payload = buildEmailPayload({
    formType,
    fields,
    honeypot,
    destination,
    replyTo,
  });

  return sendTransactionalEmail(payload);
};
