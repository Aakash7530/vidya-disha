
DROP POLICY "Anyone can submit contact" ON public.contacts;
CREATE POLICY "Anyone can submit contact" ON public.contacts
  FOR INSERT WITH CHECK (
    length(trim(name)) > 0 AND
    length(trim(email)) > 0 AND
    length(trim(message)) > 0
  );
