-- Apply to staging before enabling the updated confirmation endpoint.
BEGIN;

CREATE FUNCTION public.claim_first_billing(p_order_id text, p_customer_key text, p_amount integer)
RETURNS boolean LANGUAGE sql SECURITY INVOKER SET search_path = '' AS $$
  WITH claimed AS (
    UPDATE public.orders SET status = 'billing_processing'
    WHERE order_id = p_order_id AND customer_key = p_customer_key
      AND monthly_fee = p_amount AND p_amount > 0 AND status = 'pending'
    RETURNING 1
  )
  SELECT EXISTS (SELECT 1 FROM claimed);
$$;

CREATE FUNCTION public.complete_first_billing(
  p_order_id text, p_customer_key text, p_billing_key text,
  p_next_billing_at date, p_payment jsonb
)
RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  confirmed_order public.orders%ROWTYPE;
BEGIN
  SELECT * INTO STRICT confirmed_order FROM public.orders
  WHERE order_id = p_order_id AND customer_key = p_customer_key FOR UPDATE;

  IF confirmed_order.status <> 'billing_processing'
    OR p_payment->>'orderId' IS DISTINCT FROM p_order_id
    OR p_payment->>'status' IS DISTINCT FROM 'DONE'
    OR (p_payment->>'totalAmount')::integer IS DISTINCT FROM confirmed_order.monthly_fee
    OR coalesce(p_payment->>'paymentKey', '') = ''
    OR coalesce(p_billing_key, '') = '' THEN
    RAISE EXCEPTION 'Invalid first billing confirmation';
  END IF;

  INSERT INTO public.subscriptions (customer_key, billing_key, plan, monthly_fee, status, next_billing_at)
  VALUES (p_customer_key, p_billing_key, confirmed_order.plan, confirmed_order.monthly_fee, 'active', p_next_billing_at)
  ON CONFLICT (customer_key) DO UPDATE SET billing_key = EXCLUDED.billing_key, plan = EXCLUDED.plan,
    monthly_fee = EXCLUDED.monthly_fee, status = EXCLUDED.status, next_billing_at = EXCLUDED.next_billing_at;

  INSERT INTO public.payments (order_id, customer_key, payment_key, amount, kind, status, raw)
  VALUES (p_order_id, p_customer_key, p_payment->>'paymentKey', confirmed_order.monthly_fee, 'first', 'DONE', p_payment);

  UPDATE public.orders SET status = 'paid' WHERE id = confirmed_order.id;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_first_billing(text,text,integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.complete_first_billing(text,text,text,date,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_first_billing(text,text,integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.complete_first_billing(text,text,text,date,jsonb) TO service_role;
COMMIT;
