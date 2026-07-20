insert into public.themes (id, name, tokens, preview_url) values
  ('11111111-1111-1111-1111-111111111101', 'Midnight Rose', '{"primary":"#e11d48","background":"#0f0f14","foreground":"#fafafa","accent":"#fda4af"}', null),
  ('11111111-1111-1111-1111-111111111102', 'Soft Dawn', '{"primary":"#6366f1","background":"#faf7f5","foreground":"#1c1917","accent":"#a5b4fc"}', null);

insert into public.templates (slug, name, type, description, sort_order, available, default_config) values
  ('digital-card-classic', 'Digital Card', 'digital_card', 'Beautiful animated cards for any occasion', 1, true, '{"configVersion":1,"recipientName":"","senderName":"","message":"","accentColor":"#e11d48","backgroundStyle":"gradient"}'),
  ('spotify-cassette', 'Spotify Cassette', 'spotify_cassette', 'Share a playlist as a retro cassette tape', 2, true, '{"configVersion":1,"title":"","subtitle":"","coverColor":"#1db954"}'),
  ('apology-letter', 'Apology Letter', 'apology_letter', 'Interactive letter with envelope reveal', 3, true, '{"configVersion":1,"recipientName":"","senderName":"","greeting":"Dear","body":"","closing":"With love","signature":"","accentColor":"#6366f1"}'),
  ('love-letter', 'Love Letter', 'love_letter', 'Romantic letter with photo gallery', 4, true, '{"configVersion":1,"recipientName":"","senderName":"","message":"","accentColor":"#e11d48","photoUrls":[]}'),
  ('birthday-page', 'Birthday Page', 'birthday_page', 'Celebrate with confetti and age counter', 5, true, '{"configVersion":1,"name":"","age":0,"message":"","accentColor":"#f59e0b"}'),
  ('memory-timeline', 'Memory Timeline', 'memory_timeline', 'Scroll through cherished memories', 6, true, '{"configVersion":1,"title":"","memories":[],"accentColor":"#8b5cf6"}'),
  ('countdown', 'Countdown Page', 'countdown', 'Build anticipation to a special date', 7, true, '{"configVersion":1,"title":"","message":"","targetDate":"","accentColor":"#06b6d4"}'),
  ('invitation', 'Invitation', 'invitation', 'Elegant event invitations with RSVP', 8, true, '{"configVersion":1,"eventName":"","date":"","location":"","message":"","accentColor":"#10b981"}'),
  ('gift-reveal', 'Gift Reveal', 'gift_reveal', 'Scratch to reveal a surprise gift', 9, true, '{"configVersion":1,"title":"","revealMessage":"","giftDescription":"","accentColor":"#ec4899"}'),
  ('confession', 'Confession Page', 'confession', 'Share what is on your heart', 10, true, '{"configVersion":1,"message":"","accentColor":"#64748b","anonymous":false}');
