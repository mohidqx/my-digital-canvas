
-- ============================================================
-- GHOST CHAT — TeamCyberØps Covert Communication System
-- ============================================================

-- 1. Ghost Chat Rooms
CREATE TABLE public.ghost_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  invite_code TEXT NOT NULL UNIQUE DEFAULT substr(md5(random()::text), 1, 12),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_members INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ghost_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rooms are viewable by members" ON public.ghost_rooms
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create rooms" ON public.ghost_rooms
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room creators can update their rooms" ON public.ghost_rooms
  FOR UPDATE USING (auth.uid() = created_by);

-- 2. Ghost Members (agents in each room)
CREATE TABLE public.ghost_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.ghost_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  codename TEXT NOT NULL,
  avatar_color TEXT NOT NULL DEFAULT '#6610F2',
  role TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('commander', 'agent', 'observer')),
  is_online BOOLEAN NOT NULL DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);

ALTER TABLE public.ghost_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members visible to room participants" ON public.ghost_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ghost_members gm
      WHERE gm.room_id = ghost_members.room_id AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join rooms" ON public.ghost_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own member record" ON public.ghost_members
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can leave rooms" ON public.ghost_members
  FOR DELETE USING (auth.uid() = user_id);

-- 3. Ghost Messages
CREATE TABLE public.ghost_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.ghost_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image', 'system', 'encrypted')),
  encrypted_content TEXT,
  file_url TEXT,
  file_name TEXT,
  file_size BIGINT,
  file_type TEXT,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  self_destruct_at TIMESTAMP WITH TIME ZONE,
  reply_to UUID REFERENCES public.ghost_messages(id) ON DELETE SET NULL,
  reactions JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ghost_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Messages visible to room members" ON public.ghost_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ghost_members gm
      WHERE gm.room_id = ghost_messages.room_id AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Room members can send messages" ON public.ghost_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.ghost_members gm
      WHERE gm.room_id = ghost_messages.room_id AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Senders can update their messages" ON public.ghost_messages
  FOR UPDATE USING (auth.uid() = sender_id);

CREATE POLICY "Senders can delete their messages" ON public.ghost_messages
  FOR DELETE USING (auth.uid() = sender_id);

-- 4. Message Read Receipts
CREATE TABLE public.ghost_read_receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.ghost_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id)
);

ALTER TABLE public.ghost_read_receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read receipts visible to self" ON public.ghost_read_receipts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can mark messages as read" ON public.ghost_read_receipts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Typing Indicators
CREATE TABLE public.ghost_typing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.ghost_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_typing BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);

ALTER TABLE public.ghost_typing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Typing visible to room members" ON public.ghost_typing
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ghost_members gm
      WHERE gm.room_id = ghost_typing.room_id AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert typing status" ON public.ghost_typing
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their typing" ON public.ghost_typing
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their typing" ON public.ghost_typing
  FOR DELETE USING (auth.uid() = user_id);

-- 6. File Storage Bucket for Chat Attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('ghost-chat-files', 'ghost-chat-files', true);

CREATE POLICY "Anyone can view ghost chat files" ON storage.objects
  FOR SELECT USING (bucket_id = 'ghost-chat-files');

CREATE POLICY "Authenticated users can upload ghost chat files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'ghost-chat-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own ghost chat files" ON storage.objects
  FOR DELETE USING (bucket_id = 'ghost-chat-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 7. Timestamps trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_ghost_rooms_updated_at
  BEFORE UPDATE ON public.ghost_rooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ghost_messages_updated_at
  BEFORE UPDATE ON public.ghost_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ghost_typing_updated_at
  BEFORE UPDATE ON public.ghost_typing
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Enable Realtime on critical tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.ghost_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ghost_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ghost_typing;

-- 9. Indexes for performance
CREATE INDEX idx_ghost_messages_room_id ON public.ghost_messages(room_id, created_at DESC);
CREATE INDEX idx_ghost_members_room_id ON public.ghost_members(room_id);
CREATE INDEX idx_ghost_members_user_id ON public.ghost_members(user_id);
CREATE INDEX idx_ghost_typing_room_id ON public.ghost_typing(room_id);
CREATE INDEX idx_ghost_rooms_invite_code ON public.ghost_rooms(invite_code);
