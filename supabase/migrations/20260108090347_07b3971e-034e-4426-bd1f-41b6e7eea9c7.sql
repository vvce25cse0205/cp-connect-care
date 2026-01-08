-- Create care_team table for storing healthcare provider contacts
CREATE TABLE public.care_team (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL, -- 'neurologist', 'orthopedist', 'physical_therapist', 'primary_doctor', 'occupational_therapist', 'speech_therapist', 'other'
  phone TEXT,
  email TEXT,
  clinic_name TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create equipment table for tracking assistive devices
CREATE TABLE public.equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'wheelchair', 'walker', 'afo', 'stander', 'communication_device', 'other'
  serial_number TEXT,
  purchase_date DATE,
  last_maintenance DATE,
  next_maintenance DATE,
  size TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sleep_logs table for tracking sleep patterns
CREATE TABLE public.sleep_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE,
  sleep_date DATE NOT NULL,
  bedtime TIME,
  wake_time TIME,
  total_hours NUMERIC(4,2),
  quality INTEGER CHECK (quality >= 1 AND quality <= 5), -- 1-5 rating
  night_wakings INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mood_journal table for caregiver self-care
CREATE TABLE public.mood_journal (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mood_level INTEGER CHECK (mood_level >= 1 AND mood_level <= 5), -- 1-5 rating
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5), -- 1-5 rating
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5), -- 1-5 rating
  notes TEXT,
  gratitude TEXT,
  self_care_done TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create success_stories table for community wins
CREATE TABLE public.success_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  category TEXT, -- 'milestone', 'therapy', 'daily_win', 'equipment', 'other'
  is_anonymous BOOLEAN DEFAULT false,
  display_name TEXT,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.care_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

-- Care Team RLS Policies
CREATE POLICY "Users can view own care team" ON public.care_team FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own care team" ON public.care_team FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own care team" ON public.care_team FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own care team" ON public.care_team FOR DELETE USING (auth.uid() = user_id);

-- Equipment RLS Policies
CREATE POLICY "Users can view own equipment" ON public.equipment FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own equipment" ON public.equipment FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own equipment" ON public.equipment FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own equipment" ON public.equipment FOR DELETE USING (auth.uid() = user_id);

-- Sleep Logs RLS Policies
CREATE POLICY "Users can view own sleep logs" ON public.sleep_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sleep logs" ON public.sleep_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sleep logs" ON public.sleep_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sleep logs" ON public.sleep_logs FOR DELETE USING (auth.uid() = user_id);

-- Mood Journal RLS Policies
CREATE POLICY "Users can view own mood journal" ON public.mood_journal FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mood journal" ON public.mood_journal FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mood journal" ON public.mood_journal FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own mood journal" ON public.mood_journal FOR DELETE USING (auth.uid() = user_id);

-- Success Stories RLS Policies (everyone can view, only owner can modify)
CREATE POLICY "Everyone can view success stories" ON public.success_stories FOR SELECT USING (true);
CREATE POLICY "Users can insert own stories" ON public.success_stories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stories" ON public.success_stories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own stories" ON public.success_stories FOR DELETE USING (auth.uid() = user_id);

-- Add update triggers for updated_at
CREATE TRIGGER update_care_team_updated_at BEFORE UPDATE ON public.care_team FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON public.equipment FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();