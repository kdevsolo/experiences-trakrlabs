-- Allow authenticated users to create payment rows for their own experiences.
create policy "Users insert own payments" on public.payments
  for insert with check (auth.uid() = user_id);
