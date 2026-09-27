
-- ENUMS
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.account_status AS ENUM ('active', 'suspended');
CREATE TYPE public.task_category AS ENUM ('surveys', 'social_media', 'data_entry', 'research', 'content', 'simple');
CREATE TYPE public.submission_status AS ENUM ('submitted', 'approved', 'rejected');
CREATE TYPE public.txn_type AS ENUM ('task_reward', 'withdrawal', 'deposit', 'referral_bonus');
CREATE TYPE public.txn_status AS ENUM ('pending', 'completed', 'failed', 'rejected');
CREATE TYPE public.payout_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'rejected');

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  phone TEXT,
  mpesa_number TEXT,
  avatar_url TEXT,
  referral_code TEXT NOT NULL UNIQUE,
  referred_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  pending_balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_earned NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_withdrawn NUMERIC(12,2) NOT NULL DEFAULT 0,
  status public.account_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- USER ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "own profile readable" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "admins update profiles" ON public.profiles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- protect money columns from user edits
CREATE OR REPLACE FUNCTION public.protect_profile_money()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') THEN RETURN NEW; END IF;
  NEW.balance := OLD.balance;
  NEW.pending_balance := OLD.pending_balance;
  NEW.total_earned := OLD.total_earned;
  NEW.total_withdrawn := OLD.total_withdrawn;
  NEW.referral_code := OLD.referral_code;
  NEW.referred_by := OLD.referred_by;
  NEW.status := OLD.status;
  NEW.updated_at := now();
  RETURN NEW;
END; $$;
CREATE TRIGGER protect_profile_money BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.protect_profile_money();

-- TASKS
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  instructions TEXT NOT NULL DEFAULT '',
  requirements TEXT,
  category public.task_category NOT NULL DEFAULT 'simple',
  reward NUMERIC(12,2) NOT NULL DEFAULT 0,
  estimated_minutes INTEGER NOT NULL DEFAULT 10,
  deadline TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tasks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks TO authenticated;
GRANT ALL ON public.tasks TO service_role;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "active tasks public" ON public.tasks FOR SELECT USING (is_active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage tasks" ON public.tasks FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- TASK SUBMISSIONS
CREATE TABLE public.task_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  submission TEXT NOT NULL DEFAULT '',
  status public.submission_status NOT NULL DEFAULT 'submitted',
  review_note TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (task_id, user_id)
);
GRANT SELECT, INSERT, UPDATE ON public.task_submissions TO authenticated;
GRANT ALL ON public.task_submissions TO service_role;
ALTER TABLE public.task_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own submissions readable" ON public.task_submissions FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "own submissions insert" ON public.task_submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins review submissions" ON public.task_submissions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- TRANSACTIONS
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type public.txn_type NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status public.txn_status NOT NULL DEFAULT 'pending',
  reference TEXT NOT NULL DEFAULT ('KP' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,10))),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own transactions readable" ON public.transactions FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- WITHDRAWALS
CREATE TABLE public.withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mpesa_number TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  net_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  status public.payout_status NOT NULL DEFAULT 'pending',
  reference TEXT NOT NULL DEFAULT ('WD' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,10))),
  admin_note TEXT,
  processed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.withdrawals TO authenticated;
GRANT UPDATE ON public.withdrawals TO authenticated;
GRANT ALL ON public.withdrawals TO service_role;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own withdrawals readable" ON public.withdrawals FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "own withdrawals insert" ON public.withdrawals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins update withdrawals" ON public.withdrawals FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- DEPOSITS
CREATE TABLE public.deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  phone_number TEXT NOT NULL,
  reference TEXT NOT NULL DEFAULT ('DP' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,10))),
  status public.payout_status NOT NULL DEFAULT 'pending',
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.deposits TO authenticated;
GRANT UPDATE ON public.deposits TO authenticated;
GRANT ALL ON public.deposits TO service_role;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own deposits readable" ON public.deposits FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "own deposits insert" ON public.deposits FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins update deposits" ON public.deposits FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- REFERRALS
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward NUMERIC(12,2) NOT NULL DEFAULT 0,
  status public.txn_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (referred_user_id),
  CHECK (referrer_id <> referred_user_id)
);
GRANT SELECT ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own referrals readable" ON public.referrals FOR SELECT TO authenticated USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id OR public.has_role(auth.uid(), 'admin'));

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own notifications readable" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "own notifications update" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- NEW USER HANDLER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  new_code TEXT;
  ref_code TEXT;
  referrer UUID;
BEGIN
  LOOP
    new_code := 'KP' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.profiles WHERE referral_code = new_code);
  END LOOP;

  ref_code := nullif(trim(NEW.raw_user_meta_data ->> 'referral_code'), '');
  IF ref_code IS NOT NULL THEN
    SELECT id INTO referrer FROM public.profiles WHERE upper(referral_code) = upper(ref_code) LIMIT 1;
  END IF;
  IF referrer = NEW.id THEN referrer := NULL; END IF;

  INSERT INTO public.profiles (id, full_name, email, phone, mpesa_number, referral_code, referred_by)
  VALUES (
    NEW.id,
    coalesce(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email,
    NEW.raw_user_meta_data ->> 'phone',
    NEW.raw_user_meta_data ->> 'phone',
    new_code,
    referrer
  );

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;

  IF referrer IS NOT NULL THEN
    INSERT INTO public.referrals (referrer_id, referred_user_id, reward, status)
    VALUES (referrer, NEW.id, 50, 'pending') ON CONFLICT DO NOTHING;
  END IF;

  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (NEW.id, 'Welcome to KaziPesa', 'Your account is ready. Browse available tasks to start earning.', 'info');

  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- SUBMISSION REVIEW -> money movement
CREATE OR REPLACE FUNCTION public.handle_submission_review()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  task_reward NUMERIC(12,2);
  task_title TEXT;
  ref_row public.referrals%ROWTYPE;
BEGIN
  IF NEW.status = OLD.status THEN RETURN NEW; END IF;
  SELECT reward, title INTO task_reward, task_title FROM public.tasks WHERE id = NEW.task_id;

  IF NEW.status = 'approved' THEN
    UPDATE public.profiles
      SET balance = balance + task_reward,
          total_earned = total_earned + task_reward,
          pending_balance = greatest(pending_balance - task_reward, 0),
          updated_at = now()
      WHERE id = NEW.user_id;

    INSERT INTO public.transactions (user_id, type, amount, description, status)
    VALUES (NEW.user_id, 'task_reward', task_reward, 'Reward for task: ' || task_title, 'completed');

    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (NEW.user_id, 'Task approved', 'Your submission for "' || task_title || '" was approved.', 'success');

    SELECT * INTO ref_row FROM public.referrals WHERE referred_user_id = NEW.user_id AND status = 'pending';
    IF ref_row.id IS NOT NULL THEN
      UPDATE public.referrals SET status = 'completed' WHERE id = ref_row.id;
      UPDATE public.profiles
        SET balance = balance + ref_row.reward,
            total_earned = total_earned + ref_row.reward,
            updated_at = now()
        WHERE id = ref_row.referrer_id;
      INSERT INTO public.transactions (user_id, type, amount, description, status)
      VALUES (ref_row.referrer_id, 'referral_bonus', ref_row.reward, 'Referral bonus', 'completed');
      INSERT INTO public.notifications (user_id, title, message, type)
      VALUES (ref_row.referrer_id, 'Referral reward earned', 'One of your referrals completed their first task.', 'success');
    END IF;

  ELSIF NEW.status = 'rejected' THEN
    UPDATE public.profiles SET pending_balance = greatest(pending_balance - task_reward, 0), updated_at = now() WHERE id = NEW.user_id;
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (NEW.user_id, 'Task rejected', 'Your submission for "' || task_title || '" was not approved.', 'error');
  END IF;

  NEW.reviewed_at := now();
  RETURN NEW;
END; $$;
CREATE TRIGGER on_submission_review BEFORE UPDATE ON public.task_submissions FOR EACH ROW EXECUTE FUNCTION public.handle_submission_review();

-- submission insert -> pending balance
CREATE OR REPLACE FUNCTION public.handle_submission_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE task_reward NUMERIC(12,2);
BEGIN
  SELECT reward INTO task_reward FROM public.tasks WHERE id = NEW.task_id;
  UPDATE public.profiles SET pending_balance = pending_balance + task_reward, updated_at = now() WHERE id = NEW.user_id;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_submission_insert AFTER INSERT ON public.task_submissions FOR EACH ROW EXECUTE FUNCTION public.handle_submission_insert();

-- WITHDRAWAL REQUEST
CREATE OR REPLACE FUNCTION public.handle_withdrawal_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE avail NUMERIC(12,2);
BEGIN
  SELECT balance INTO avail FROM public.profiles WHERE id = NEW.user_id FOR UPDATE;
  IF avail IS NULL OR avail < NEW.amount THEN
    RAISE EXCEPTION 'Insufficient balance for this withdrawal';
  END IF;
  NEW.fee := round(greatest(NEW.amount * 0.02, 10), 2);
  NEW.net_amount := NEW.amount - NEW.fee;
  IF NEW.net_amount <= 0 THEN RAISE EXCEPTION 'Withdrawal amount is too small'; END IF;
  UPDATE public.profiles SET balance = balance - NEW.amount, updated_at = now() WHERE id = NEW.user_id;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_withdrawal_insert BEFORE INSERT ON public.withdrawals FOR EACH ROW EXECUTE FUNCTION public.handle_withdrawal_insert();

CREATE OR REPLACE FUNCTION public.handle_withdrawal_created()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.transactions (user_id, type, amount, description, status, reference)
  VALUES (NEW.user_id, 'withdrawal', NEW.amount, 'M-Pesa withdrawal to ' || NEW.mpesa_number, 'pending', NEW.reference);
  RETURN NEW;
END; $$;
CREATE TRIGGER on_withdrawal_created AFTER INSERT ON public.withdrawals FOR EACH ROW EXECUTE FUNCTION public.handle_withdrawal_created();

-- WITHDRAWAL REVIEW
CREATE OR REPLACE FUNCTION public.handle_withdrawal_review()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = OLD.status THEN RETURN NEW; END IF;

  IF NEW.status = 'completed' THEN
    UPDATE public.profiles SET total_withdrawn = total_withdrawn + NEW.amount, updated_at = now() WHERE id = NEW.user_id;
    UPDATE public.transactions SET status = 'completed' WHERE reference = NEW.reference;
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (NEW.user_id, 'Withdrawal processed', 'Your withdrawal of KES ' || NEW.net_amount || ' has been processed.', 'success');
    NEW.processed_at := now();
  ELSIF NEW.status IN ('failed', 'rejected') THEN
    UPDATE public.profiles SET balance = balance + NEW.amount, updated_at = now() WHERE id = NEW.user_id;
    UPDATE public.transactions SET status = (CASE WHEN NEW.status = 'failed' THEN 'failed' ELSE 'rejected' END)::public.txn_status WHERE reference = NEW.reference;
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (NEW.user_id, 'Withdrawal not completed', 'Your withdrawal request was not completed and the amount was returned to your balance.', 'error');
    NEW.processed_at := now();
  END IF;

  RETURN NEW;
END; $$;
CREATE TRIGGER on_withdrawal_review BEFORE UPDATE ON public.withdrawals FOR EACH ROW EXECUTE FUNCTION public.handle_withdrawal_review();

-- DEPOSITS
CREATE OR REPLACE FUNCTION public.handle_deposit_created()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.transactions (user_id, type, amount, description, status, reference)
  VALUES (NEW.user_id, 'deposit', NEW.amount, 'Deposit from ' || NEW.phone_number, 'pending', NEW.reference);
  RETURN NEW;
END; $$;
CREATE TRIGGER on_deposit_created AFTER INSERT ON public.deposits FOR EACH ROW EXECUTE FUNCTION public.handle_deposit_created();

CREATE OR REPLACE FUNCTION public.handle_deposit_review()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = OLD.status THEN RETURN NEW; END IF;
  IF NEW.status = 'completed' THEN
    UPDATE public.profiles SET balance = balance + NEW.amount, updated_at = now() WHERE id = NEW.user_id;
    UPDATE public.transactions SET status = 'completed' WHERE reference = NEW.reference;
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (NEW.user_id, 'Deposit confirmed', 'Your deposit of KES ' || NEW.amount || ' has been confirmed.', 'success');
  ELSIF NEW.status IN ('failed','rejected') THEN
    UPDATE public.transactions SET status = (CASE WHEN NEW.status = 'failed' THEN 'failed' ELSE 'rejected' END)::public.txn_status WHERE reference = NEW.reference;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_deposit_review BEFORE UPDATE ON public.deposits FOR EACH ROW EXECUTE FUNCTION public.handle_deposit_review();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER touch_tasks BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- DEMO TASKS
INSERT INTO public.tasks (title, description, instructions, requirements, category, reward, estimated_minutes, deadline) VALUES
('Short consumer survey', 'Answer a 10-question survey about everyday shopping habits.', 'Open the survey form, answer every question honestly, then paste your completion code below.', 'Must be 18+ and based in Kenya.', 'surveys', 75.00, 10, now() + interval '14 days'),
('Follow and engage with a brand page', 'Follow a local brand page and leave one genuine comment.', 'Follow the page, leave a genuine comment, then submit a link to your profile and comment.', 'An active social media account at least 30 days old.', 'social_media', 40.00, 5, now() + interval '21 days'),
('Enter 20 rows of product data', 'Copy product details from a provided sheet into a form.', 'Download the sample sheet, enter each row into the form, then submit the confirmation reference.', 'Basic spreadsheet skills.', 'data_entry', 150.00, 30, now() + interval '10 days'),
('Research 5 local suppliers', 'Find and list five suppliers with contact details for a given category.', 'Compile the supplier names, phone numbers and locations and paste them in your submission.', 'Internet access and careful checking of details.', 'research', 200.00, 45, now() + interval '15 days'),
('Write a 200-word product description', 'Write an original short description for a listed product.', 'Write an original 200-word description, no copied text, and paste it in the submission box.', 'Clear written English.', 'content', 180.00, 25, now() + interval '12 days'),
('Verify 10 business listings', 'Check that 10 listed businesses have correct phone numbers.', 'Call or check each listing, mark correct or incorrect, and submit your findings.', 'Airtime for short calls.', 'simple', 90.00, 20, now() + interval '18 days');
