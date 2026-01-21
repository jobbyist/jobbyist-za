import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message_at: string | null;
  created_at: string;
  otherUser?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
  lastMessage?: Message;
}

export function useMessaging() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchConversations();
      const cleanup = subscribeToMessages();
      return cleanup;
    } else {
      setConversations([]);
      setMessages([]);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation);
    }
  }, [activeConversation]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          messages!inner(
            id,
            content,
            sender_id,
            is_read,
            created_at
          )
        `)
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false })
        .order('created_at', { foreignTable: 'messages', ascending: false })
        .limit(1, { foreignTable: 'messages' });

      if (error) throw error;

      // Fetch other user details for each conversation
      const conversationsWithUsers = await Promise.all(
        (data || []).map(async (conv) => {
          const otherUserId = conv.participant1_id === user.id ? conv.participant2_id : conv.participant1_id;
          
          const { data: profileData } = await supabase
            .from('profiles')
            .select('user_id, first_name, last_name, avatar_url')
            .eq('user_id', otherUserId)
            .single();

          const messages = (conv as any).messages || [];
          const lastMessage = messages.length > 0 ? messages[0] : null;

          return {
            ...conv,
            otherUser: profileData ? {
              id: profileData.user_id,
              first_name: profileData.first_name,
              last_name: profileData.last_name,
              avatar_url: profileData.avatar_url,
            } : undefined,
            lastMessage,
          };
        })
      );

      setConversations(conversationsWithUsers);
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark messages as read
      await markMessagesAsRead(conversationId);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
    }
  };

  const markMessagesAsRead = async (conversationId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('is_read', false)
        .neq('sender_id', user.id);
    } catch (error: any) {
      console.error('Error marking messages as read:', error);
    }
  };

  const createConversation = async (otherUserId: string) => {
    if (!user) {
      toast.error('Please sign in to send messages');
      return { error: new Error('Not authenticated'), conversation: null };
    }

    try {
      // Check if conversation already exists
      const { data: existingConv, error: checkError } = await supabase
        .from('conversations')
        .select('id')
        .or(
          `and(participant1_id.eq.${user.id},participant2_id.eq.${otherUserId}),` +
          `and(participant1_id.eq.${otherUserId},participant2_id.eq.${user.id})`
        )
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingConv) {
        setActiveConversation(existingConv.id);
        return { error: null, conversation: existingConv };
      }

      // Create new conversation
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          participant1_id: user.id,
          participant2_id: otherUserId,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchConversations();
      setActiveConversation(data.id);
      return { error: null, conversation: data };
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      toast.error('Failed to create conversation');
      return { error, conversation: null };
    }
  };

  const sendMessage = async (conversationId: string, content: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content,
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation's last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);

      await fetchMessages(conversationId);
      await fetchConversations();
      return { error: null, message: data };
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return { error, message: null };
    }
  };

  const subscribeToMessages = () => {
    if (!user) return;

    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          if (payload.new.conversation_id === activeConversation) {
            fetchMessages(activeConversation);
          }
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const getUnreadCount = (): number => {
    return conversations.reduce((count, conv) => {
      if (conv.lastMessage && 
          conv.lastMessage.sender_id !== user?.id && 
          !conv.lastMessage.is_read) {
        return count + 1;
      }
      return count;
    }, 0);
  };

  return {
    conversations,
    activeConversation,
    messages,
    loading,
    setActiveConversation,
    createConversation,
    sendMessage,
    getUnreadCount,
    refetch: fetchConversations,
  };
}
