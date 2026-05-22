# Direct Messaging Implementation Guide

## Overview

This document outlines the setup and implementation for a direct messaging system between employers/recruiters and job seekers using Supabase Realtime.

**Status**: 🚧 **Future Implementation** - Infrastructure setup documented for future development

## Features

- Real-time messaging between employers and job seekers
- Message threading and conversations
- Read/unread status tracking
- Typing indicators
- File attachments (CV, portfolio links)
- Push notifications for new messages

## Database Schema

### 1. conversations table

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ,
  
  -- Participants
  jobseeker_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  employer_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  
  -- Optional: Link to specific job application
  job_application_id UUID REFERENCES job_applications(id) ON DELETE SET NULL,
  
  -- Status
  is_archived BOOLEAN DEFAULT FALSE,
  
  UNIQUE(jobseeker_id, employer_id, job_application_id)
);

-- Indexes for performance
CREATE INDEX idx_conversations_jobseeker ON conversations(jobseeker_id);
CREATE INDEX idx_conversations_employer ON conversations(employer_id);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);
```

### 2. messages table

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  
  -- Message content
  content TEXT NOT NULL CHECK (LENGTH(content) > 0 AND LENGTH(content) <= 5000),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  edited BOOLEAN DEFAULT FALSE,
  
  -- Attachments (JSON array of URLs)
  attachments JSONB DEFAULT '[]',
  
  -- Read tracking
  read_at TIMESTAMPTZ,
  read_by UUID REFERENCES profiles(user_id)
);

-- Indexes
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_unread ON messages(conversation_id, read_at) WHERE read_at IS NULL;
```

### 3. typing_indicators table (optional, for real-time typing status)

```sql
CREATE TABLE typing_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  last_typed_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(conversation_id, user_id)
);

-- Auto-cleanup old indicators (older than 10 seconds)
CREATE OR REPLACE FUNCTION cleanup_old_typing_indicators()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM typing_indicators
  WHERE last_typed_at < NOW() - INTERVAL '10 seconds';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cleanup_typing
AFTER INSERT ON typing_indicators
EXECUTE FUNCTION cleanup_old_typing_indicators();
```

## Row Level Security (RLS) Policies

### Conversations

```sql
-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Jobseekers can view their own conversations
CREATE POLICY "Jobseekers can view their conversations"
ON conversations FOR SELECT
USING (auth.uid() = jobseeker_id);

-- Employers can view conversations they're part of
CREATE POLICY "Employers can view their conversations"
ON conversations FOR SELECT
USING (auth.uid() = employer_id);

-- Jobseekers can create conversations
CREATE POLICY "Jobseekers can create conversations"
ON conversations FOR INSERT
WITH CHECK (auth.uid() = jobseeker_id);

-- Employers can create conversations
CREATE POLICY "Employers can create conversations"
ON conversations FOR INSERT
WITH CHECK (auth.uid() = employer_id);

-- Users can update their own conversation metadata
CREATE POLICY "Users can update their conversations"
ON conversations FOR UPDATE
USING (auth.uid() = jobseeker_id OR auth.uid() = employer_id);
```

### Messages

```sql
-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can read messages in their conversations
CREATE POLICY "Users can read messages in their conversations"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE id = messages.conversation_id
    AND (jobseeker_id = auth.uid() OR employer_id = auth.uid())
  )
);

-- Users can send messages in their conversations
CREATE POLICY "Users can send messages in their conversations"
ON messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM conversations
    WHERE id = messages.conversation_id
    AND (jobseeker_id = auth.uid() OR employer_id = auth.uid())
  )
);

-- Users can update their own messages (for read status)
CREATE POLICY "Users can update message read status"
ON messages FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE id = messages.conversation_id
    AND (jobseeker_id = auth.uid() OR employer_id = auth.uid())
  )
);
```

## Supabase Realtime Setup

### 1. Enable Realtime for tables

In your Supabase dashboard:
1. Go to Database → Replication
2. Enable replication for:
   - `conversations`
   - `messages`
   - `typing_indicators` (optional)

### 2. Subscribe to changes in your React app

```typescript
// hooks/useDirectMessaging.tsx
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useConversationMessages(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) return;

    let channel: RealtimeChannel;

    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
      setLoading(false);
    };

    // Subscribe to new messages
    const subscribeToMessages = () => {
      channel = supabase
        .channel(`conversation:${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === payload.new.id ? (payload.new as Message) : msg
              )
            );
          }
        )
        .subscribe();
    };

    fetchMessages();
    subscribeToMessages();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [conversationId]);

  return { messages, loading };
}

// Send message function
export async function sendMessage(
  conversationId: string,
  content: string,
  attachments: string[] = []
) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      content,
      attachments,
    })
    .select()
    .single();

  if (error) throw error;

  // Update conversation's last_message_at
  await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId);

  return data;
}
```

## UI Components

### 1. MessagesInbox Component

Located at: `src/components/messaging/MessagesInbox.tsx`

Features:
- List of conversations
- Unread message badges
- Search and filter
- Archive conversations

### 2. ConversationView Component

Located at: `src/components/messaging/ConversationView.tsx`

Features:
- Message thread display
- Real-time message updates
- Send message input
- Typing indicators
- Attachment uploads

### 3. Integration with Profile Page

Add a "Messages" tab to the job seeker's profile dashboard:

```tsx
// src/pages/Profile.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare } from "lucide-react";

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="applications">Applications</TabsTrigger>
    <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
    <TabsTrigger value="messages">
      <MessageSquare className="h-4 w-4 mr-2" />
      Messages
    </TabsTrigger>
  </TabsList>
  
  <TabsContent value="messages">
    <MessagesInbox userId={user.id} />
  </TabsContent>
</Tabs>
```

## Push Notifications (Future)

### Setup with Supabase Edge Functions

Create an edge function to send push notifications when new messages arrive:

```typescript
// supabase/functions/notify-new-message/index.ts
Deno.serve(async (req) => {
  const { message, recipientId } = await req.json();
  
  // Get recipient's push subscription
  const { data: profile } = await supabase
    .from('profiles')
    .select('push_subscription')
    .eq('user_id', recipientId)
    .single();
  
  if (profile?.push_subscription) {
    // Send push notification via Web Push API
    // Implementation details depend on your push service
  }
  
  // Optionally send email notification
  // ...
  
  return new Response(JSON.stringify({ success: true }));
});
```

## Environment Variables

Add to Supabase Edge Functions:

```bash
# For push notifications (optional)
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key

# For email notifications (optional)
RESEND_API_KEY=your_resend_api_key
```

## Testing Checklist

- [ ] Create conversation between jobseeker and employer
- [ ] Send messages in both directions
- [ ] Verify real-time message delivery
- [ ] Test read status updates
- [ ] Test typing indicators
- [ ] Test file attachments
- [ ] Verify RLS policies prevent unauthorized access
- [ ] Test conversation archiving
- [ ] Test unread message counts
- [ ] Test push notifications (if implemented)

## Security Considerations

1. **Rate Limiting**: Implement rate limiting on message sending to prevent spam
2. **Content Moderation**: Consider adding content filtering for inappropriate messages
3. **Report/Block**: Allow users to report or block abusive conversations
4. **Data Retention**: Define message retention policy (e.g., delete after 90 days)
5. **Encryption**: Consider end-to-end encryption for sensitive conversations

## Implementation Timeline

**Phase 1** (Recommended):
- ✅ Database schema created
- ✅ RLS policies defined
- ✅ Realtime enabled

**Phase 2** (To be implemented):
- [ ] UI components (MessagesInbox, ConversationView)
- [ ] Real-time subscriptions
- [ ] Message sending/receiving

**Phase 3** (Nice to have):
- [ ] Typing indicators
- [ ] Push notifications
- [ ] File attachments
- [ ] Message search

## Related Documentation

- [Supabase Realtime Documentation](https://supabase.com/docs/guides/realtime)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)

## Support

For questions or issues with direct messaging implementation:
- Email: support@jobbyist.africa
- Documentation: This file

---

**Last Updated**: 2026-05-22
**Status**: Documentation complete, implementation pending
