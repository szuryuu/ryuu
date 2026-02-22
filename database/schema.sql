-- Enable Row Level Security to restrict access per row.
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read guestbook entries.
CREATE POLICY "allow_read" ON guestbook
FOR SELECT USING (true);

-- Allow only authenticated users to insert entries matching their own user_id.
CREATE POLICY "allow_insert_authenticated" ON guestbook
FOR INSERT TO authenticated
WITH CHECK ( (select auth.uid()) = user_id );
