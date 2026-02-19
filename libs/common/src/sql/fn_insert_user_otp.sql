-- FUNCTION: public.fn_insert_user_otp(uuid, text, otp_purpose, integer)

-- DROP FUNCTION IF EXISTS public.fn_insert_user_otp(uuid, text, otp_purpose, integer);

CREATE OR REPLACE FUNCTION public.fn_insert_user_otp(
	p_user_id uuid,
	p_otp_hash text,
	p_otp_purpose otp_purpose,
	p_expiry_minutes integer)
    RETURNS fn_return_type
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
	v_error TEXT;
	v_message TEXT;
	v_expires_at TIMESTAMPTZ;
BEGIN
	-- Soft delete old otps for the same purpose
	UPDATE tbl_user_otps
	SET is_deleted = TRUE,
		updated_at = NOW()
	WHERE user_id = p_user_id
		AND otp_purpose = p_otp_purpose
		AND is_deleted = FALSE;

	v_expires_at := NOW() + (p_expiry_minutes || 'minutes') :: INTERVAL;

	INSERT INTO tbl_user_otps(user_id, otp_hash, otp_purpose, expires_at) VALUES (p_user_id, p_otp_hash, p_otp_purpose, v_expires_at);

	v_message := 'OTP GENERATED SUCCESSFULLY';
	RETURN ROW(
		TRUE,
		v_message,
		json_build_object(
			'expiresAt', v_expires_at
		) :: jsonb
	);
	
EXCEPTION
    WHEN OTHERS THEN
		v_error := SQLERRM;
		RAISE NOTICE 'INSERT USER OTP ERROR: %', v_error;
        RETURN ROW(
            FALSE,
            v_error,
            NULL::jsonb
        );
END;
$BODY$;

ALTER FUNCTION public.fn_insert_user_otp(uuid, text, otp_purpose, integer)
    OWNER TO neondb_owner;
