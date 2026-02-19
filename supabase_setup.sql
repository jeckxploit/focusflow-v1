/*
  ENABLE RLS ON SESSIONS TABLE
  This ensures users can only see and manage their own focus data.
*/

-- 1. Enable RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- 2. Policy: Users can only read their own data
CREATE POLICY "Users can view their own sessions" 
ON sessions FOR SELECT 
USING (auth.uid() = user_id);

-- 3. Policy: Users can only insert their own data
CREATE POLICY "Users can insert their own sessions" 
ON sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 4. Policy: Users can only update their own data
CREATE POLICY "Users can update their own sessions" 
ON sessions FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. Policy: Users can only delete their own data
CREATE POLICY "Users can delete their own sessions" 
ON sessions FOR DELETE 
USING (auth.uid() = user_id);
