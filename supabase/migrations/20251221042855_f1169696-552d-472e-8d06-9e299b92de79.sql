-- Create medicines table
CREATE TABLE public.medicines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  timing TEXT,
  notes TEXT,
  quantity INTEGER DEFAULT 0,
  unit TEXT DEFAULT 'tablets',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own medicines" ON public.medicines FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own medicines" ON public.medicines FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own medicines" ON public.medicines FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own medicines" ON public.medicines FOR DELETE USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_medicines_updated_at BEFORE UPDATE ON public.medicines 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create increment_user_points function
CREATE OR REPLACE FUNCTION public.increment_user_points(
  p_user_id UUID,
  p_points INTEGER DEFAULT 10,
  p_activities INTEGER DEFAULT 0,
  p_sessions INTEGER DEFAULT 0,
  p_milestones INTEGER DEFAULT 0
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.user_points
  SET 
    total_points = COALESCE(total_points, 0) + p_points,
    activities_completed = COALESCE(activities_completed, 0) + p_activities,
    sessions_logged = COALESCE(sessions_logged, 0) + p_sessions,
    milestones_achieved = COALESCE(milestones_achieved, 0) + p_milestones,
    updated_at = now()
  WHERE user_id = p_user_id;
END;
$$;