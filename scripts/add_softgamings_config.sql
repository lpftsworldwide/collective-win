-- =====================================================
-- ADD SOFTGAMINGS API CONFIGURATION
-- =====================================================
-- Run this script AFTER you get API credentials from SoftGamings
-- Replace all YOUR_* placeholders with actual values

DO $$
DECLARE
  v_provider_id UUID;
  v_config_exists BOOLEAN;
BEGIN
  -- Get or create SoftGamings provider
  SELECT id INTO v_provider_id
  FROM public.game_providers
  WHERE code = 'softgamings';

  IF v_provider_id IS NULL THEN
    INSERT INTO public.game_providers (
      name, 
      code, 
      status, 
      license_jurisdiction, 
      rng_certification, 
      integration_type, 
      api_endpoint
    )
    VALUES (
      'SoftGamings',
      'softgamings',
      'active',
      'MGA, Curacao',
      'GLI, eCOGRA',
      'aggregator',
      'https://api.softgamings.com/v1' -- Confirm actual endpoint with SoftGamings
    )
    RETURNING id INTO v_provider_id;
  END IF;

  -- Check if config already exists
  SELECT EXISTS(
    SELECT 1 FROM public.game_provider_configs 
    WHERE provider_id = v_provider_id AND status = 'active'
  ) INTO v_config_exists;

  IF NOT v_config_exists THEN
    -- Insert new configuration
    INSERT INTO public.game_provider_configs (
      provider_id,
      aggregator_name,
      aggregator_api_endpoint,
      aggregator_api_key,
      aggregator_secret_key,
      merchant_id,
      iframe_base_url,
      launch_url_template,
      status
    ) VALUES (
      v_provider_id,
      'softgamings',
      'YOUR_API_ENDPOINT', -- e.g., https://api.softgamings.com/v1
      'YOUR_API_KEY', -- Get from SoftGamings
      'YOUR_SECRET_KEY', -- Get from SoftGamings
      'YOUR_MERCHANT_ID', -- Get from SoftGamings (if required)
      'YOUR_IFRAME_BASE_URL', -- e.g., https://games.softgamings.com
      'YOUR_LAUNCH_URL_TEMPLATE', -- e.g., https://games.softgamings.com/launch?game={gameCode}&token={token}
      'active'
    );
    
    RAISE NOTICE 'SoftGamings configuration added. Status: active';
  ELSE
    -- Update existing configuration
    UPDATE public.game_provider_configs
    SET
      aggregator_api_endpoint = 'YOUR_API_ENDPOINT',
      aggregator_api_key = 'YOUR_API_KEY',
      aggregator_secret_key = 'YOUR_SECRET_KEY',
      merchant_id = 'YOUR_MERCHANT_ID',
      iframe_base_url = 'YOUR_IFRAME_BASE_URL',
      launch_url_template = 'YOUR_LAUNCH_URL_TEMPLATE',
      updated_at = now()
    WHERE provider_id = v_provider_id AND status = 'active';
    
    RAISE NOTICE 'SoftGamings configuration updated.';
  END IF;

  -- Activate SoftGamings provider
  UPDATE public.game_providers
  SET status = 'active'
  WHERE id = v_provider_id;

  RAISE NOTICE 'SoftGamings provider activated.';
  RAISE NOTICE 'Provider ID: %', v_provider_id;

END $$;

-- Verify configuration
SELECT 
  gp.name as provider_name,
  gp.code as provider_code,
  gp.status as provider_status,
  gpc.aggregator_name,
  gpc.status as config_status,
  CASE 
    WHEN gpc.aggregator_api_key IS NOT NULL THEN 'API Key: Set'
    ELSE 'API Key: Missing'
  END as api_key_status
FROM public.game_providers gp
LEFT JOIN public.game_provider_configs gpc ON gp.id = gpc.provider_id AND gpc.status = 'active'
WHERE gp.code = 'softgamings';

