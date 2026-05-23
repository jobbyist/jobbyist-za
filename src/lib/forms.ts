import { supabase } from "@/integrations/supabase/client";

export const validateEmail = (email: string) => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}$/;
  return emailRegex.test(email.trim());
};

export const normaliseFormData = <T extends Record<string, string>>(data: T): T => {
  const cleaned = Object.entries(data).map(([key, value]) => [key, value.trim()]);
  return Object.fromEntries(cleaned) as T;
};

interface BuildEmailPayloadInput {
  formType: string;
  subject: string;
  fields: Record<string, string>;
  replyTo?: string;
  sourcePage?: string;
}

export const buildEmailPayload = ({
  formType,
  subject,
  fields,
  replyTo,
  sourcePage,
}: BuildEmailPayloadInput) => ({
  formType,
  subject,
  fields,
  replyTo,
  sourcePage,
});

interface SubmitLeadFormInput {
  formType: string;
  subject: string;
  fields: Record<string, string>;
  replyTo?: string;
  sourcePage?: string;
  honeypot?: string;
}

export const submitLeadForm = async ({
  formType,
  subject,
  fields,
  replyTo,
  sourcePage,
  honeypot,
}: SubmitLeadFormInput) => {
  if (honeypot && honeypot.trim().length > 0) {
    return { success: true, blocked: true };
  }

  const payload = buildEmailPayload({
    formType,
    subject,
    fields: normaliseFormData(fields),
    replyTo: replyTo?.trim(),
    sourcePage,
  });

  const { data, error } = await supabase.functions.invoke("submit-lead-form", {
    body: payload,
  });

  if (error) {
    throw new Error(error.message || "We could not submit your request.");
  }

  if (!data?.success) {
    throw new Error(data?.error || "We could not submit your request.");
  }

  return data;
};
