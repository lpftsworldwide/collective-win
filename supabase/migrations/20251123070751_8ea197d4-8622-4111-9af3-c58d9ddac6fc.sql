-- Add bonus_balance column to users table
ALTER TABLE public.users 
ADD COLUMN bonus_balance numeric DEFAULT 0.00 NOT NULL,
ADD COLUMN is_bonus_claimed boolean DEFAULT false NOT NULL;

-- Create RTP configuration table
CREATE TABLE public.game_rtp_config (
  game_id text PRIMARY KEY,
  base_rtp numeric NOT NULL CHECK (base_rtp >= 85.0 AND base_rtp <= 99.0),
  rtp_min numeric NOT NULL CHECK (rtp_min >= 85.0 AND rtp_min <= 99.0),
  rtp_max numeric NOT NULL CHECK (rtp_max >= 85.0 AND rtp_max <= 99.0),
  current_rtp numeric NOT NULL CHECK (current_rtp >= 85.0 AND current_rtp <= 99.0),
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CHECK (rtp_min <= base_rtp AND base_rtp <= rtp_max)
);

-- Enable RLS on RTP config (read-only for players, admin writes handled server-side)
ALTER TABLE public.game_rtp_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view RTP config"
ON public.game_rtp_config
FOR SELECT
USING (true);

-- Create atomic transaction processor function
CREATE OR REPLACE FUNCTION public.process_wager_transaction(
  p_user_id uuid,
  p_game_id text,
  p_wager_amount numeric,
  p_payout_amount numeric DEFAULT 0
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_balance numeric;
  v_wager_tx_id uuid;
  v_payout_tx_id uuid;
  v_session_id uuid;
BEGIN
  -- Start atomic transaction
  -- Check sufficient balance
  SELECT total_balance_aud INTO v_current_balance
  FROM users
  WHERE id = p_user_id
  FOR UPDATE; -- Lock row to prevent race conditions
  
  IF v_current_balance IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  IF v_current_balance < p_wager_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;
  
  -- Create game session
  INSERT INTO game_sessions (user_id, game_id, wager_amount, payout_amount)
  VALUES (p_user_id, p_game_id, p_wager_amount, p_payout_amount)
  RETURNING id INTO v_session_id;
  
  -- Debit wager amount
  UPDATE users
  SET total_balance_aud = total_balance_aud - p_wager_amount
  WHERE id = p_user_id;
  
  -- Record wager transaction
  INSERT INTO transactions (user_id, type, amount, status)
  VALUES (p_user_id, 'wager', p_wager_amount, 'completed')
  RETURNING id INTO v_wager_tx_id;
  
  -- Credit payout if win
  IF p_payout_amount > 0 THEN
    UPDATE users
    SET total_balance_aud = total_balance_aud + p_payout_amount
    WHERE id = p_user_id;
    
    INSERT INTO transactions (user_id, type, amount, status)
    VALUES (p_user_id, 'payout', p_payout_amount, 'completed')
    RETURNING id INTO v_payout_tx_id;
  END IF;
  
  -- Update game session end time
  UPDATE game_sessions
  SET end_time = now(), payout_amount = p_payout_amount
  WHERE id = v_session_id;
  
  -- Return result
  RETURN json_build_object(
    'success', true,
    'session_id', v_session_id,
    'wager_tx_id', v_wager_tx_id,
    'payout_tx_id', v_payout_tx_id,
    'new_balance', (SELECT total_balance_aud FROM users WHERE id = p_user_id)
  );
END;
$$;

-- Create function to process deposits
CREATE OR REPLACE FUNCTION public.process_deposit(
  p_user_id uuid,
  p_amount numeric,
  p_transaction_hash text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tx_id uuid;
  v_new_balance numeric;
BEGIN
  -- Credit deposit amount
  UPDATE users
  SET total_balance_aud = total_balance_aud + p_amount
  WHERE id = p_user_id;
  
  -- Record deposit transaction
  INSERT INTO transactions (user_id, type, amount, status, transaction_hash)
  VALUES (p_user_id, 'deposit', p_amount, 'completed', p_transaction_hash)
  RETURNING id INTO v_tx_id;
  
  -- Get new balance
  SELECT total_balance_aud INTO v_new_balance
  FROM users
  WHERE id = p_user_id;
  
  RETURN json_build_object(
    'success', true,
    'transaction_id', v_tx_id,
    'new_balance', v_new_balance
  );
END;
$$;

-- Create function to process withdrawals
CREATE OR REPLACE FUNCTION public.process_withdrawal(
  p_user_id uuid,
  p_amount numeric,
  p_transaction_hash text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_balance numeric;
  v_is_kyc_verified boolean;
  v_tx_id uuid;
  v_new_balance numeric;
BEGIN
  -- Check KYC verification and balance
  SELECT total_balance_aud, is_kyc_verified INTO v_current_balance, v_is_kyc_verified
  FROM users
  WHERE id = p_user_id
  FOR UPDATE;
  
  IF NOT v_is_kyc_verified THEN
    RAISE EXCEPTION 'KYC verification required for withdrawals';
  END IF;
  
  IF v_current_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance for withdrawal';
  END IF;
  
  -- Debit withdrawal amount
  UPDATE users
  SET total_balance_aud = total_balance_aud - p_amount
  WHERE id = p_user_id;
  
  -- Record withdrawal transaction (pending status)
  INSERT INTO transactions (user_id, type, amount, status, transaction_hash)
  VALUES (p_user_id, 'withdrawal', p_amount, 'pending', p_transaction_hash)
  RETURNING id INTO v_tx_id;
  
  -- Get new balance
  SELECT total_balance_aud INTO v_new_balance
  FROM users
  WHERE id = p_user_id;
  
  RETURN json_build_object(
    'success', true,
    'transaction_id', v_tx_id,
    'new_balance', v_new_balance,
    'status', 'pending'
  );
END;
$$;