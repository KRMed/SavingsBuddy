import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vfwdbyxaglhwtichpunt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmd2RieXhhZ2xod3RpY2hwdW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjA1NDQsImV4cCI6MjA2MjgzNjU0NH0.MXk1h5dfKLB3SGYXw8ij4BeXYp-WjxlOjEn0iTPwnSE'
export const supabase = createClient(supabaseUrl, supabaseKey)