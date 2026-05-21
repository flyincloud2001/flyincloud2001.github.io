-- ================================================================
-- Personal Website — New Supabase Project Setup SQL
-- Project: foster-personal-website (zstlvzvkbhhufbxpqvky)
-- Run this entire script in:
--   https://app.supabase.com/project/zstlvzvkbhhufbxpqvky/sql/new
-- ================================================================

-- ── 1. Tables ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title_zh        text        NOT NULL DEFAULT '',
  title_en        text        NOT NULL DEFAULT '',
  description_zh  text        NOT NULL DEFAULT '',
  description_en  text        NOT NULL DEFAULT '',
  url             text        DEFAULT '',
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS books (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title_zh        text        NOT NULL DEFAULT '',
  title_en        text        NOT NULL DEFAULT '',
  review_zh       text        NOT NULL DEFAULT '',
  review_en       text        NOT NULL DEFAULT '',
  author_en       text        DEFAULT '',
  author_zh       text        DEFAULT '',          -- NEW: Chinese author name
  cover_image_url text        DEFAULT '',          -- NEW: cover image URL
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id     uuid        NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  content     text        NOT NULL,
  nickname    text        DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS photos (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  url         text        NOT NULL,
  caption_zh  text        DEFAULT '',
  caption_en  text        DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- pw_contacts: for contact form submissions
CREATE TABLE IF NOT EXISTS pw_contacts (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  email      text        NOT NULL,
  message    text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── 2. Enable RLS ─────────────────────────────────────────────────

ALTER TABLE projects   ENABLE ROW LEVEL SECURITY;
ALTER TABLE books      ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos     ENABLE ROW LEVEL SECURITY;
ALTER TABLE pw_contacts ENABLE ROW LEVEL SECURITY;

-- ── 3. RLS Policies (admin = flyincloud2001@gmail.com only) ───────

-- projects
CREATE POLICY "projects_read"   ON projects FOR SELECT USING (true);
CREATE POLICY "projects_write"  ON projects FOR ALL TO authenticated
  USING      (auth.email() = 'flyincloud2001@gmail.com')
  WITH CHECK (auth.email() = 'flyincloud2001@gmail.com');

-- books
CREATE POLICY "books_read"  ON books FOR SELECT USING (true);
CREATE POLICY "books_write" ON books FOR ALL TO authenticated
  USING      (auth.email() = 'flyincloud2001@gmail.com')
  WITH CHECK (auth.email() = 'flyincloud2001@gmail.com');

-- comments: public read + insert, admin delete
CREATE POLICY "comments_read"   ON comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON comments FOR INSERT  WITH CHECK (true);
CREATE POLICY "comments_delete" ON comments FOR DELETE  TO authenticated
  USING (auth.email() = 'flyincloud2001@gmail.com');

-- photos
CREATE POLICY "photos_read"  ON photos FOR SELECT USING (true);
CREATE POLICY "photos_write" ON photos FOR ALL TO authenticated
  USING      (auth.email() = 'flyincloud2001@gmail.com')
  WITH CHECK (auth.email() = 'flyincloud2001@gmail.com');

-- pw_contacts: public insert, admin read/delete
CREATE POLICY "contacts_insert" ON pw_contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "contacts_admin"  ON pw_contacts FOR ALL TO authenticated
  USING      (auth.email() = 'flyincloud2001@gmail.com')
  WITH CHECK (auth.email() = 'flyincloud2001@gmail.com');

-- ── 4. Storage bucket: pw-photos ─────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pw-photos', 'pw-photos', true, 10485760,
  ARRAY['image/jpeg','image/png','image/webp','image/gif','image/avif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "pw_photos_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'pw-photos');

CREATE POLICY "pw_photos_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'pw-photos'
    AND auth.email() = 'flyincloud2001@gmail.com');

CREATE POLICY "pw_photos_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'pw-photos'
    AND auth.email() = 'flyincloud2001@gmail.com');

-- ── 5. Email trigger (pg_net) ─────────────────────────────────────
-- Requires pg_net extension (enabled by default in Supabase)

CREATE OR REPLACE FUNCTION notify_new_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_title text;
BEGIN
  SELECT COALESCE(NULLIF(title_zh,''), NULLIF(title_en,''), '未知書籍')
    INTO v_title
    FROM books WHERE id = NEW.book_id;

  PERFORM net.http_post(
    url     := 'https://zstlvzvkbhhufbxpqvky.supabase.co/functions/v1/notify-comment',
    body    := jsonb_build_object(
                 'bookTitle', v_title,
                 'comment',   NEW.content,
                 'nickname',  COALESCE(NULLIF(TRIM(NEW.nickname),''), '匿名'),
                 'bookId',    NEW.book_id::text,
                 'createdAt', to_char(NEW.created_at AT TIME ZONE 'UTC',
                                      'YYYY-MM-DD HH24:MI UTC')
               ),
    headers := '{"Content-Type":"application/json"}'::jsonb
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_comment_insert ON comments;
CREATE TRIGGER on_comment_insert
  AFTER INSERT ON comments
  FOR EACH ROW EXECUTE FUNCTION notify_new_comment();
