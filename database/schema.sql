CREATE TABLE IF NOT EXISTS article_reads (
  slug TEXT PRIMARY KEY,
  read_count INTEGER DEFAULT 0
);

CREATE OR REPLACE FUNCTION increment_read_count(article_slug TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO article_reads (slug, read_count)
  VALUES (article_slug, 1)
  ON CONFLICT (slug) DO UPDATE
  SET read_count = article_reads.read_count + 1;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE article_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_read_all" ON article_reads
FOR SELECT USING (true);
